const express = require('express');
const router = express.Router();
const { analyzeResume, analyzeSkillGaps, reviewCode, planDeadline } = require('../ai/miniTools');

// Resume analyzer
router.post('/resume/analyze', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    const analysis = await analyzeResume(resumeText, targetRole);
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: 'Resume analysis failed' });
  }
});

// Skill gap analyzer  
router.post('/skills/gap-analysis', async (req, res) => {
  try {
    const { userProfile, targetRole } = req.body;
    const gaps = await analyzeSkillGaps(userProfile, targetRole);
    res.json({ gaps });
  } catch (err) {
    res.status(500).json({ error: 'Skill gap analysis failed' });
  }
});

// Code reviewer
router.post('/code/review', async (req, res) => {
  try {
    const { code, language } = req.body;
    const review = await reviewCode(code, language);
    res.json({ review });
  } catch (err) {
    res.status(500).json({ error: 'Code review failed' });
  }
});

// Project deadline planner
router.post('/deadline/plan', async (req, res) => {
  try {
    const { projectIdea, teamSize, duration } = req.body;
    const plan = await planDeadline(projectIdea, teamSize, duration);
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: 'Deadline planning failed' });
  }
});

module.exports = router;