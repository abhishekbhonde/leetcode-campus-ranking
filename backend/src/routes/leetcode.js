const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { fetchLeetCodeStats } = require('../services/leetcode');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/leetcode/fetch/:username
router.post('/fetch/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const stats = await fetchLeetCodeStats(username);

    // Find user by leetcode username
    const user = await prisma.user.findFirst({
      where: { leetcodeUsername: username },
    });

    if (user) {
      await prisma.leetcodeStats.upsert({
        where: { userId: user.id },
        update: { ...stats, lastUpdated: new Date() },
        create: { userId: user.id, ...stats },
      });
    }

    res.json({ username, stats });
  } catch (error) {
    console.error('Fetch leetcode stats error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
