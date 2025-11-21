const mongoose = require('mongoose');

const UserStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  xp: { type: Number, default: 0 },
  badges: [{ code: String, earnedAt: Date }],
  achievements: [{ title: String, description: String, earnedAt: Date }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserStats', UserStatsSchema);
