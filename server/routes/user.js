const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.post('/update', auth, async (req, res) => {
  try {
    const { name, bio, skills, techStack, expertise, availability, github, portfolio, region, workingStyle } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    if (techStack) updateData.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()).filter(Boolean);
    if (expertise) updateData.expertise = expertise;
    if (availability !== undefined) updateData.availability = availability;
    if (github !== undefined) updateData.github = github;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (region !== undefined) updateData.region = region;
    if (workingStyle !== undefined) updateData.workingStyle = workingStyle;
    
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// Get user by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
