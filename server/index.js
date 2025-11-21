require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { initSockets } = require('./socket');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const matchmakingRoutes = require('./routes/matchmaking');
const teamRoutes = require('./routes/team');
const projectRoutes = require('./routes/project');
const aiRoutes = require('./routes/ai');
const statsRoutes = require('./routes/stats');
const adminRoutes = require('./routes/admin');
const toolsRoutes = require('./routes/tools');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/matchmaking', matchmakingRoutes);
app.use('/team', teamRoutes);
app.use('/project', projectRoutes);
app.use('/ai', aiRoutes);
app.use('/stats', statsRoutes);
app.use('/admin', adminRoutes);
app.use('/tools', toolsRoutes);

// Simple health check endpoint for uptime monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  initSockets(server);
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB connection error', err);
  process.exit(1);
});
