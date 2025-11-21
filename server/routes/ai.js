const express = require('express');
const router = express.Router();
const { generateProjectIdea, analyzeUser, aiScoreMatch, callOllamaPrompt } = require('../ai/ollama');
const auth = require('../middleware/auth');

// Generate project idea
router.post('/idea', async (req, res) => {
  try {
    const { prompt, userProfile } = req.body;
    
    if (!prompt || prompt.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Please provide a detailed prompt (at least 10 characters)',
        fallback: {
          choices: [{ text: generateFallbackIdea(prompt || 'hackathon project') }]
        }
      });
    }
    
    try {
      const idea = await generateProjectIdea({ prompt: prompt.trim(), userProfile });
      res.json({ idea, source: 'ai' });
    } catch (aiError) {
      console.warn('AI generation failed, using fallback:', aiError.message);
      const fallbackIdea = generateFallbackIdea(prompt.trim());
      res.json({ 
        idea: {
          choices: [{ text: fallbackIdea }]
        }, 
        source: 'fallback',
        message: 'AI service unavailable, generated structured fallback'
      });
    }
  } catch (err) {
    console.error('Idea generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate idea',
      fallback: {
        choices: [{ text: generateFallbackIdea(req.body.prompt || 'innovative project') }]
      }
    });
  }
});

// Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    try {
      const assistantPrompt = `You are HackMate AI, a helpful mentor for hackathon builders. Reply conversationally (max 180 words).\n\nUser: ${message}\nContext: ${context || 'general help'}\n\nProvide actionable tips, highlight next steps, and encourage the user.`;
      const responseText = await callOllamaPrompt(assistantPrompt);
      const reply = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
      res.json({ 
        response: reply,
        source: 'ai'
      });
    } catch (aiError) {
      console.warn('AI chat failed, using fallback:', aiError.message);
      const fallbackResponse = generateChatFallback(message);
      res.json({ 
        response: fallbackResponse,
        source: 'fallback',
        message: 'AI service unavailable, using built-in responses'
      });
    }
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ 
      error: 'Chat service temporarily unavailable',
      response: "I'm having trouble connecting to the AI service. Try asking about team formation, project ideas, or hackathon strategies!"
    });
  }
});

// Analyze user profile
router.post('/analyze/user', auth, async (req, res) => {
  try {
    const { userProfile } = req.body;
    const profileToAnalyze = userProfile || req.user;
    
    try {
      const analysis = await analyzeUser(profileToAnalyze);
      res.json({ analysis, source: 'ai' });
    } catch (aiError) {
      console.warn('AI analysis failed, using fallback:', aiError.message);
      const fallbackAnalysis = generateAnalysisFallback(profileToAnalyze);
      res.json({ 
        analysis: fallbackAnalysis,
        source: 'fallback',
        message: 'AI service unavailable, generated basic analysis'
      });
    }
  } catch (err) {
    console.error('User analysis error:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Generate fallback project idea
function generateFallbackIdea(prompt) {
  const ideas = {
    'ai': 'AI-Powered Study Assistant\n\nProblem: Students struggle to organize study materials and get personalized help.\n\nSolution: Create an AI-powered study assistant that:\n- Organizes notes and materials\n- Provides personalized quizzes\n- Tracks learning progress\n- Offers study recommendations\n\nTech Stack: React, Node.js, OpenAI API, MongoDB\n\nFeatures:\n- Smart note organization\n- AI-generated practice questions\n- Progress tracking dashboard\n- Collaborative study rooms',
    'blockchain': 'Decentralized Voting Platform\n\nProblem: Traditional voting systems lack transparency and trust.\n\nSolution: Build a blockchain-based voting system with:\n- Transparent vote counting\n- Voter identity verification\n- Immutable vote records\n- Real-time results\n\nTech Stack: Solidity, Web3.js, React, IPFS\n\nFeatures:\n- Smart contract voting logic\n- Cryptographic voter verification\n- Distributed vote storage\n- Public audit trail',
    'sustainability': 'Carbon Footprint Tracker\n\nProblem: Individuals lack awareness of their environmental impact.\n\nSolution: Create a personal carbon tracking app with:\n- Daily activity logging\n- Carbon footprint calculation\n- Sustainability recommendations\n- Community challenges\n\nTech Stack: React Native, Node.js, PostgreSQL, Chart.js\n\nFeatures:\n- Activity tracking\n- Impact visualization\n- Eco-friendly suggestions\n- Social challenges'
  };
  
  // Simple keyword matching for fallback ideas
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('ai') || lowerPrompt.includes('machine learning')) return ideas.ai;
  if (lowerPrompt.includes('blockchain') || lowerPrompt.includes('crypto')) return ideas.blockchain;
  if (lowerPrompt.includes('sustainability') || lowerPrompt.includes('environment')) return ideas.sustainability;
  
  return `Innovative ${prompt} Platform\n\nProblem: Current solutions in this space lack innovation and user focus.\n\nSolution: Build a modern platform that addresses key pain points through:\n- User-centered design\n- Modern technology stack\n- Scalable architecture\n- Community features\n\nTech Stack: React, Node.js, MongoDB, Socket.IO\n\nImplementation Steps:\n1. Research and user interviews\n2. Design system and wireframes\n3. Core feature development\n4. Testing and optimization\n5. Deployment and monitoring\n\nSuccess Metrics:\n- User engagement\n- Feature adoption\n- Performance benchmarks\n- Community growth`;
}

// Generate chat fallback responses
function generateChatFallback(message) {
  const responses = {
    team: "For team building, focus on finding complementary skills! Look for people with different expertise - frontend, backend, design, and domain knowledge. Use our AI matching to find compatible teammates.",
    idea: "Great project ideas often solve real problems you've experienced. Think about daily frustrations that technology could address. Consider your team's skills when choosing complexity.",
    hackathon: "Successful hackathons require good planning: define MVP early, divide tasks clearly, test frequently, and prepare a compelling demo. Time management is crucial!",
    skills: "Focus on 2-3 core skills rather than being a generalist. Popular hackathon skills include React, Node.js, Python, design tools, and cloud platforms.",
    default: "I can help with team formation, project ideas, skill development, and hackathon strategies. What specific aspect would you like advice on?"
  };
  
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('team')) return responses.team;
  if (lowerMessage.includes('idea') || lowerMessage.includes('project')) return responses.idea;
  if (lowerMessage.includes('hackathon')) return responses.hackathon;
  if (lowerMessage.includes('skill')) return responses.skills;
  
  return responses.default;
}

// Generate analysis fallback
function generateAnalysisFallback(userProfile) {
  const skillCount = (userProfile.skills || []).length;
  const hasGithub = !!userProfile.github;
  const hasPortfolio = !!userProfile.portfolio;
  
  let level = 'beginner';
  let score = 60;
  
  if (skillCount >= 5 && (hasGithub || hasPortfolio)) {
    level = 'advanced';
    score = 85;
  } else if (skillCount >= 3) {
    level = 'intermediate';
    score = 75;
  }
  
  return `Profile Analysis for ${userProfile.name || 'User'}\n\nSkill Level: ${level}\nProfile Strength: ${score}/100\n\nStrengths:\n- ${skillCount} technical skills listed\n${hasGithub ? '- GitHub profile linked' : ''}\n${hasPortfolio ? '- Portfolio available' : ''}\n\nRecommendations:\n${skillCount < 3 ? '- Add more skills to your profile\n' : ''}${!hasGithub ? '- Link your GitHub profile\n' : ''}${!hasPortfolio ? '- Add a portfolio link\n' : ''}\nTeam Role Suggestions:\n- ${userProfile.skills?.[0] || 'Full-stack'} Developer\n- Team Contributor`;
}

module.exports = router;
