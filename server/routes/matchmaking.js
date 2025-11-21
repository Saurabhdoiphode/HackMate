const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { aiScoreMatch } = require('../ai/ollama');

// Basic search endpoint
router.post('/search', async (req, res) => {
  const { skills = [], techStack = [], region, availability, expertise } = req.body;
  const query = {};
  if (skills.length) query.skills = { $in: skills };
  if (techStack.length) query.techStack = { $in: techStack };
  if (region) query.region = region;
  if (availability) query.availability = availability;
  if (expertise) query.expertise = expertise;

  const users = await User.find(query).limit(50).lean();
  // compute simple compatibility score locally
  const results = users.map(u => {
    const overlap = (u.skills || []).filter(s => skills.includes(s)).length;
    const baseScore = Math.min(100, 30 + overlap * 20);
    return { user: u, score: baseScore };
  });
  res.json({ results });
});

// Auto-match: combine local heuristics + AI scoring
router.post('/auto', async (req, res) => {
  const { userProfile } = req.body; // full profile
  const candidates = await User.find({ _id: { $ne: userProfile._id } }).limit(200).lean();

  // create input for AI scoring
  const payload = { user: userProfile, candidates: candidates.slice(0,50) };
  try {
    const aiScores = await aiScoreMatch(payload);
    // aiScores expected: [{ id, score, reason, roleSuggestion }]
    res.json({ matches: aiScores });
  } catch (err) {
    console.error('AI scoring failed', err);
    // fallback to simple scores
    const fallback = candidates.slice(0,50).map(c => ({ id: c._id, score: Math.floor(Math.random()*60)+30 }));
    res.json({ matches: fallback, warning: 'AI scoring unavailable, returned fallback' });
  }
});

module.exports = router;
