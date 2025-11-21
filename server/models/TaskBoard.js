const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const TaskBoardSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', unique: true },
  tasks: [TaskSchema]
});

module.exports = mongoose.model('TaskBoard', TaskBoardSchema);
