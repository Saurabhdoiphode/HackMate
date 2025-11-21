const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  avatar: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  techStack: [{ type: String }],
  expertise: { type: String, enum: ['Beginner','Intermediate','Advanced'], default: 'Intermediate' },
  availability: { type: String },
  workingStyle: { type: String, default: 'team' },
  github: { type: String },
  portfolio: { type: String },
  region: { type: String },
  rating: { type: Number, default: 0 },
  hackathonHistory: [{ title: String, year: Number, placement: String, repo: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
