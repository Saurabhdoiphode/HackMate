const UserStats = require('../models/UserStats');

const XP_ACTIONS = {
  team_create: 100,
  team_join: 50,
  task_complete: 25,
  project_submit: 200,
  profile_complete: 30
};

const BADGES = {
  first_team: { code: 'first_team', name: 'Team Player', description: 'Created or joined your first team' },
  skill_master: { code: 'skill_master', name: 'Skill Master', description: 'Added 10+ skills to profile' },
  task_doer: { code: 'task_doer', name: 'Task Doer', description: 'Completed 5 tasks' },
  leader: { code: 'leader', name: 'Team Leader', description: 'Led a team to project completion' }
};

async function updateUserStats(userId, action, customAmount = null) {
  let stats = await UserStats.findOne({ user: userId });
  if (!stats) {
    stats = new UserStats({ user: userId });
  }
  
  const xpGain = customAmount || XP_ACTIONS[action] || 0;
  stats.xp += xpGain;
  stats.lastUpdated = new Date();
  
  // Check for new badges
  const newBadges = await calculateBadges(userId, stats);
  newBadges.forEach(badge => {
    if (!stats.badges.find(b => b.code === badge.code)) {
      stats.badges.push({ code: badge.code, earnedAt: new Date() });
      stats.achievements.push({
        title: badge.name,
        description: badge.description,
        earnedAt: new Date()
      });
    }
  });
  
  await stats.save();
  return stats;
}

async function calculateBadges(userId, stats) {
  const badges = [];
  
  // First team badge (simplified - would need to check team membership)
  if (stats.xp >= 50 && !stats.badges.find(b => b.code === 'first_team')) {
    badges.push(BADGES.first_team);
  }
  
  // Task doer (simplified - would need task completion count)
  if (stats.xp >= 125 && !stats.badges.find(b => b.code === 'task_doer')) {
    badges.push(BADGES.task_doer);
  }
  
  return badges;
}

module.exports = { updateUserStats, calculateBadges, XP_ACTIONS, BADGES };