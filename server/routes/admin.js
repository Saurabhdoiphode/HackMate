const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Team = require('../models/Team');
const UserStats = require('../models/UserStats');

// Admin metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeams = await Team.countDocuments();
    const avgXP = await UserStats.aggregate([
      { $group: { _id: null, avgXP: { $avg: '$xp' } } }
    ]);
    
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt')
      .lean();
      
    const topTeams = await Team.find({})
      .populate('owner', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    res.json({
      stats: {
        totalUsers,
        totalTeams,
        avgXP: avgXP[0]?.avgXP || 0
      },
      recentUsers,
      topTeams
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;