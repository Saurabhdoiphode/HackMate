const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama2';

function normaliseOllamaResponse(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (typeof data.response === 'string') {
    return data.response.trim();
  }
  if (Array.isArray(data)) {
    return data.map(chunk => chunk?.response || '').join('').trim();
  }
  return JSON.stringify(data);
}

async function callOllamaPrompt(prompt) {
  try {
    const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_ctx: 2048,
        top_p: 0.9,
        max_tokens: 800
      }
    }, { timeout: 60000 });

    return normaliseOllamaResponse(res.data);
  } catch (err) {
    const message = err?.response?.data || err.message;
    console.error('Ollama call failed:', message);
    throw new Error(typeof message === 'string' ? message : 'Failed to reach local AI model');
  }
}

async function analyzeResume(resumeText, targetRole = 'hackathon participant') {
  const prompt = `
Analyze this resume for hackathon readiness targeting role: ${targetRole}

Resume:
${resumeText}

Provide JSON output:
{
  "score": 0-100,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"], 
  "suggestedSkills": ["skill1", "skill2"],
  "roleMatch": "percentage"
}
`;
  
  const result = await callOllamaPrompt(prompt);
  return parseAIResponse(result, {
    score: 75,
    strengths: ['Technical skills mentioned'],
    improvements: ['Add more project details'],
    suggestedSkills: ['React', 'Node.js'],
    roleMatch: '80%'
  });
}

async function analyzeSkillGaps(userProfile, targetRole) {
  const prompt = `
Skill gap analysis for hackathon role: ${targetRole}

Current profile:
${JSON.stringify(userProfile)}

Provide JSON output:
{
  "currentLevel": "beginner/intermediate/advanced",
  "missingSkills": ["skill1", "skill2"],
  "learningPath": ["step1", "step2"], 
  "timeToReady": "X weeks",
  "recommendations": ["rec1", "rec2"]
}
`;

  const result = await callOllamaPrompt(prompt);
  return parseAIResponse(result, {
    currentLevel: 'intermediate',
    missingSkills: ['Advanced algorithms'],
    learningPath: ['Practice coding challenges', 'Build portfolio projects'],
    timeToReady: '4-6 weeks',
    recommendations: ['Join coding bootcamp', 'Contribute to open source']
  });
}

async function reviewCode(code, language) {
  const prompt = `
Code review for ${language}:

\`\`\`${language}
${code}
\`\`\`

Provide JSON output:
{
  "score": 0-100,
  "issues": [{"type": "bug/performance/style", "line": 1, "message": "description"}],
  "suggestions": ["suggestion1", "suggestion2"],
  "complexity": "low/medium/high"
}
`;

  const result = await callOllamaPrompt(prompt);
  return parseAIResponse(result, {
    score: 85,
    issues: [],
    suggestions: ['Add error handling', 'Consider edge cases'],
    complexity: 'medium'
  });
}

async function planDeadline(projectIdea, teamSize, duration) {
  const prompt = `
Create hackathon project timeline:

Project: ${projectIdea}
Team size: ${teamSize}
Duration: ${duration}

Provide JSON output:
{
  "phases": [
    {"name": "Planning", "duration": "2 hours", "tasks": ["task1", "task2"]},
    {"name": "Development", "duration": "20 hours", "tasks": ["task1", "task2"]},
    {"name": "Testing", "duration": "4 hours", "tasks": ["task1", "task2"]},
    {"name": "Presentation", "duration": "2 hours", "tasks": ["task1", "task2"]}
  ],
  "criticalPath": ["milestone1", "milestone2"],
  "risks": ["risk1", "risk2"],
  "recommendations": ["rec1", "rec2"]
}
`;

  const result = await callOllamaPrompt(prompt);
  return parseAIResponse(result, {
    phases: [
      { name: "Planning", duration: "2 hours", tasks: ["Define MVP", "Setup repo"] },
      { name: "Development", duration: "20 hours", tasks: ["Core features", "UI implementation"] },
      { name: "Testing", duration: "4 hours", tasks: ["Unit tests", "Integration testing"] },
      { name: "Presentation", duration: "2 hours", tasks: ["Demo prep", "Pitch slides"] }
    ],
    criticalPath: ["MVP definition", "Core feature completion"],
    risks: ["Scope creep", "Technical debt"],
    recommendations: ["Start with wireframes", "Deploy early and often"]
  });
}

function parseAIResponse(aiOutput, fallback) {
  try {
    // Try to extract JSON from AI response
    const text = typeof aiOutput === 'string' ? aiOutput : JSON.stringify(aiOutput);
    
    // Look for JSON blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Look for structured output patterns
    if (text.includes('"score"') || text.includes('"phases"')) {
      // Try to repair common JSON issues
      const repaired = text
        .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
        .replace(/'/g, '"')           // Replace single quotes
        .replace(/,\s*}/, '}')        // Remove trailing commas
        .replace(/,\s*]/, ']');
      
      const cleanedMatch = repaired.match(/\{[\s\S]*\}/);
      if (cleanedMatch) {
        return JSON.parse(cleanedMatch[0]);
      }
    }
  } catch (err) {
    console.warn('AI response parsing failed:', err.message);
  }
  
  // Return fallback if parsing fails
  return fallback;
}

module.exports = { analyzeResume, analyzeSkillGaps, reviewCode, planDeadline, parseAIResponse };