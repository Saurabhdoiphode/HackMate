const axios = require('axios');
const { parseAIResponse } = require('./miniTools');

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama2';

function normaliseOllamaResponse(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;

  // When stream=false the response field contains the full text
  if (typeof data.response === 'string') {
    return data.response.trim();
  }

  // Sometimes we get an array of chunks
  if (Array.isArray(data)) {
    return data.map(chunk => chunk?.response || '').join('').trim();
  }

  return JSON.stringify(data);
}

async function callOllamaPrompt(prompt) {
  try {
    // Allow disabling local model calls in hosted environments
    if (process.env.DISABLE_LOCAL_AI === 'true') {
      return 'Local AI disabled; using fallback guidance.';
    }
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

async function generateProjectIdea({ prompt, userProfile }) {
  const fullPrompt = `You are HackMate AI, a senior hackathon mentor. Craft a structured project blueprint.\n\nUser profile:${JSON.stringify(userProfile)}\nPrompt:${prompt || ''}\n\nRespond with sections: Title, Problem, Solution, Key Features, Tech Stack, Timeline, Next Steps.`;
  const responseText = await callOllamaPrompt(fullPrompt);

  return {
    choices: [
      {
        text: responseText
      }
    ]
  };
}

async function analyzeUser(userProfile) {
  const prompt = `Analyze this hackathon participant:\n${JSON.stringify(userProfile)}\n\nProvide strengths, ideal teammates, suggested project areas, and growth tips.`;
  return callOllamaPrompt(prompt);
}

async function aiScoreMatch(payload) {
  const prompt = `You are matching teammates for a hackathon.\n\nTarget user:${JSON.stringify(payload.user)}\nCandidate list:${JSON.stringify(payload.candidates)}\n\nReturn JSON array [{"id":"candidateId","score":0-100,"reason":"why they match","roleSuggestion":"recommended role"}] with at most 5 entries.`;
  const result = await callOllamaPrompt(prompt);

  try {
    const fallback = payload.candidates.map(candidate => ({
      id: candidate._id,
      score: Math.floor(Math.random() * 40) + 60,
      reason: 'Heuristic fallback match',
      roleSuggestion: candidate.preferredRole || 'Teammate'
    }));

    return parseAIResponse(result, fallback);
  } catch (error) {
    return payload.candidates.map(candidate => ({
      id: candidate._id,
      score: Math.floor(Math.random() * 40) + 60,
      reason: 'Parsing failed, using fallback',
      roleSuggestion: candidate.preferredRole || 'Teammate'
    }));
  }
}

module.exports = { generateProjectIdea, analyzeUser, aiScoreMatch, callOllamaPrompt, normaliseOllamaResponse };
