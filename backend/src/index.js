require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const leaderboardRoutes = require('./routes/leaderboard');
const leetcodeRoutes = require('./routes/leetcode');
const collegeRoutes = require('./routes/colleges');
const { updateAllStats } = require('./jobs/updateStats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/colleges', collegeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cron job: Update LeetCode stats every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('⏰ Running scheduled LeetCode stats update...');
  updateAllStats();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
