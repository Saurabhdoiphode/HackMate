const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register (simple)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({ name, email, passwordHash: hash });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash || '');
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '1h' });
    
    // In production, send email with reset link
    // For demo, just return the token
    res.json({ 
      message: 'Password reset token generated', 
      resetToken, 
      // In production, don't send token in response, send email instead
      demoUrl: `http://localhost:5173/reset-password?token=${resetToken}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    user.passwordHash = hash;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    const user = await User.findById(data.id).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;