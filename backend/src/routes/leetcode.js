const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { fetchLeetCodeStats, matchSchoolToCollege } = require('../services/leetcode');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/leetcode/fetch/:username — fetch & upsert stats
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
        update: {
          totalSolved: stats.totalSolved,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
          contestRating: stats.contestRating,
          globalRanking: stats.globalRanking,
          lastUpdated: new Date(),
        },
        create: {
          userId: user.id,
          totalSolved: stats.totalSolved,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
          contestRating: stats.contestRating,
          globalRanking: stats.globalRanking,
        },
      });
    }

    res.json({ username, stats });
  } catch (error) {
    console.error('Fetch leetcode stats error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/leetcode/discover — discover a LeetCode user's school
router.post('/discover', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const stats = await fetchLeetCodeStats(username);

    if (!stats.school) {
      return res.json({
        username,
        school: null,
        message: 'No school found on this LeetCode profile.',
        stats,
      });
    }

    // Try to match to existing college
    const matched = await matchSchoolToCollege(prisma, stats.school);

    res.json({
      username,
      school: stats.school,
      matchedCollege: matched || null,
      stats,
    });
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/leetcode/bulk-discover — discover schools for multiple usernames
router.post('/bulk-discover', async (req, res) => {
  try {
    const { usernames } = req.body;

    if (!usernames || !Array.isArray(usernames)) {
      return res.status(400).json({ error: 'An array of usernames is required.' });
    }

    const results = [];
    for (const username of usernames.slice(0, 20)) {
      const stats = await fetchLeetCodeStats(username);
      const matched = stats.school ? await matchSchoolToCollege(prisma, stats.school) : null;
      results.push({
        username,
        school: stats.school || null,
        matchedCollege: matched || null,
        totalSolved: stats.totalSolved,
      });
      // Rate limit
      await new Promise((r) => setTimeout(r, 500));
    }

    res.json({ results });
  } catch (error) {
    console.error('Bulk discover error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
