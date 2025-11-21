// Build a simple skill-based graph and recommend clusters
// Placeholder community detection: group by overlapping skill count threshold

function buildGraph(users){
  // nodes: user ids, edges if skill overlap >= threshold
  const threshold = 2;
  const nodes = users.map(u=>u._id);
  const edges = [];
  for(let i=0;i<users.length;i++){
    for(let j=i+1;j<users.length;j++){
      const a = users[i];
      const b = users[j];
      const overlap = (a.skills||[]).filter(s=> (b.skills||[]).includes(s)).length;
      if(overlap >= threshold){
        edges.push({ from: a._id, to: b._id, weight: overlap });
      }
    }
  }
  return { nodes, edges };
}

function detectClusters(graph){
  // naive union-find on edges
  const parent = {};
  graph.nodes.forEach(n=> parent[n]=n);
  function find(x){ return parent[x]===x?x: (parent[x]=find(parent[x])); }
  function union(a,b){ const pa=find(a), pb=find(b); if(pa!==pb) parent[pb]=pa; }
  graph.edges.forEach(e=> union(e.from,e.to));
  const groups = {};
  graph.nodes.forEach(n=>{ const p=find(n); groups[p]=groups[p]||[]; groups[p].push(n); });
  return Object.values(groups).filter(g=>g.length>1);
}

function recommendTeams(users){
  const graph = buildGraph(users);
  const clusters = detectClusters(graph);
  // Score cluster by combined unique skills
  const detailed = clusters.map(ids => {
    const clusterUsers = users.filter(u=> ids.includes(u._id));
    const uniqueSkills = new Set(clusterUsers.flatMap(u=>u.skills||[]));
    return {
      members: ids,
      size: ids.length,
      uniqueSkillCount: uniqueSkills.size,
      suggested: uniqueSkills.size >= ids.length * 3 // heuristic flag
    };
  }).sort((a,b)=> b.uniqueSkillCount - a.uniqueSkillCount);
  return detailed.slice(0,10);
}

module.exports = { buildGraph, recommendTeams };
