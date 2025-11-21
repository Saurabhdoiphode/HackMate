const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const { updateUserStats, calculateBadges } = require('../utils/statsManager');

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  const topUsers = await UserStats.find({})
    .populate('user', 'name avatar')
    .sort({ xp: -1 })
    .limit(50)
    .lean();
  res.json({ leaderboard: topUsers });
});

// Update user XP (called after team activities)
router.post('/update-xp/:userId', async (req, res) => {
  const { action, amount } = req.body; // e.g. action: 'team_create', amount: 100
  try {
    const stats = await updateUserStats(req.params.userId, action, amount);
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user stats
router.get('/:userId', async (req, res) => {
  let stats = await UserStats.findOne({ user: req.params.userId }).populate('user', 'name avatar').lean();
  if (!stats) {
    stats = await new UserStats({ user: req.params.userId }).save();
  }
  res.json({ stats });
});

module.exports = router;