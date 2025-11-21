const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const TaskBoard = require('../models/TaskBoard');
const { assignRoles } = require('../utils/roleAssignment');
const { recommendTeams } = require('../utils/graphRecommend');
const auth = require('../middleware/auth');

// Get all teams (public)
router.get('/', async (req, res) => {
  try {
    const { search, limit = 20 } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const teams = await Team.find(query)
      .populate('owner', 'name avatar expertise')
      .populate('members.user', 'name avatar skills expertise')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
      
    res.json({ teams });
  } catch (err) {
    console.error('Teams fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
});

// create team
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description, projectIdea, techStack, lookingFor, maxMembers = 5 } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: 'Team name and description are required' });
    }
    
    const team = new Team({ 
      name: name.trim(),
      owner: req.user._id, 
      members: [{ user: req.user._id, role: 'Owner', joinedAt: new Date() }], 
      description: description.trim(),
      projectIdea: projectIdea?.trim() || '',
      techStack: Array.isArray(techStack) ? techStack : (techStack || '').split(',').map(s => s.trim()).filter(Boolean),
      lookingFor: Array.isArray(lookingFor) ? lookingFor : (lookingFor || '').split(',').map(s => s.trim()).filter(Boolean),
      maxMembers
    });
    
    await team.save();
    
    // Initialize task board
    await new TaskBoard({ team: team._id, tasks: [] }).save();
    
    // Get populated team data
    const populatedTeam = await Team.findById(team._id)
      .populate('owner', 'name avatar skills expertise')
      .populate('members.user', 'name avatar skills expertise');
    
    // Role assignment
    const memberProfiles = [req.user];
    const roles = assignRoles(memberProfiles);
    
    res.status(201).json({ team: populatedTeam, roles, message: 'Team created successfully!' });
  } catch (err) {
    console.error('Team creation error:', err);
    res.status(500).json({ message: 'Failed to create team', error: err.message });
  }
});

// join team
router.post('/join', async (req, res) => {
  const { teamId, userId, role } = req.body;
  const team = await Team.findById(teamId);
  if (!team) return res.status(404).send('Not found');
  const user = await User.findById(userId).lean();
  if(!user) return res.status(400).json({ message: 'User not found'});
  team.members.push({ user: userId, role: role || 'Member' });
  await team.save();
  // Recompute role suggestions for entire team
  const memberProfiles = await User.find({ _id: { $in: team.members.map(m=>m.user) } }).lean();
  const roles = assignRoles(memberProfiles);
  res.json({ team, roles });
});

// Recommend clusters (team suggestions) from all users
router.get('/recommend/clusters', async (req, res) => {
  const users = await User.find({}).limit(200).lean();
  const clusters = recommendTeams(users);
  res.json({ clusters });
});

// Get task board
router.get('/:teamId/tasks', async (req, res) => {
  const board = await TaskBoard.findOne({ team: req.params.teamId }).lean();
  if(!board) return res.status(404).send('Board not found');
  res.json({ board });
});

// Add task
router.post('/:teamId/tasks', async (req, res) => {
  const { title, description, assignee } = req.body;
  const board = await TaskBoard.findOne({ team: req.params.teamId });
  if(!board) return res.status(404).send('Board not found');
  board.tasks.push({ title, description, assignee });
  await board.save();
  res.json({ board });
});

module.exports = router;
