const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  idea: String,
  techStack: [String],
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
