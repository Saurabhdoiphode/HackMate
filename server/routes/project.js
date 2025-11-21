const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.post('/idea', async (req, res) => {
  const { prompt } = req.body;
  // For now delegate to AI route
  res.json({ message: 'Use /ai/idea for AI-generated project ideas' });
});

module.exports = router;
