// Simple role assignment based on skill keywords & expertise
// Roles: Team Leader, Backend Dev, Frontend Dev, ML Engineer, Designer, Deployment Expert

const ROLE_KEYWORDS = {
  backend: ['node','express','api','database','mongo','sql','python','java'],
  frontend: ['react','vue','angular','css','html','tailwind','ui'],
  ml: ['ml','machine learning','data','pytorch','tensorflow','model','ai'],
  designer: ['design','figma','ux','ui/ux','wireframe','branding'],
  devops: ['docker','kubernetes','deploy','ci','cd','pipeline','cloud','aws','render','vercel']
};

function scoreForRole(user, roleList){
  const skills = (user.skills||[]).map(s=>s.toLowerCase());
  let score = 0;
  roleList.forEach(k=>{ if(skills.some(s=>s.includes(k))) score += 10; });
  // expertise weight
  if(user.expertise === 'Advanced') score += 15; else if(user.expertise === 'Intermediate') score += 7;
  return score;
}

function assignRoles(members){
  // Determine leader: highest total skill count + expertise weight
  const leader = [...members].sort((a,b)=>{
    const aScore = (a.skills||[]).length + (a.expertise==='Advanced'?10: a.expertise==='Intermediate'?5:0);
    const bScore = (b.skills||[]).length + (b.expertise==='Advanced'?10: b.expertise==='Intermediate'?5:0);
    return bScore - aScore;
  })[0];

  const assignments = members.map(m=>({ id: m._id, roles: [] }));
  assignments.forEach(a=>{
    const user = members.find(m=>m._id===a.id);
    const roleScores = {
      backend: scoreForRole(user, ROLE_KEYWORDS.backend),
      frontend: scoreForRole(user, ROLE_KEYWORDS.frontend),
      ml: scoreForRole(user, ROLE_KEYWORDS.ml),
      designer: scoreForRole(user, ROLE_KEYWORDS.designer),
      devops: scoreForRole(user, ROLE_KEYWORDS.devops)
    };
    // pick top 2 roles
    const sorted = Object.entries(roleScores).sort((x,y)=>y[1]-x[1]).filter(e=>e[1]>0).map(e=>e[0]);
    a.roles = sorted.slice(0,2);
  });
  const leaderAssign = assignments.find(a=>a.id===leader._id);
  if(leaderAssign && !leaderAssign.roles.includes('leader')) leaderAssign.roles.unshift('leader');
  return assignments;
}

module.exports = { assignRoles };
