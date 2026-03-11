const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/leaderboard/:collegeId
router.get('/:collegeId', async (req, res) => {
  try {
    const collegeId = parseInt(req.params.collegeId);

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found.' });
    }

    const users = await prisma.user.findMany({
      where: { collegeId },
      include: { leetcodeStats: true },
      orderBy: { leetcodeStats: { totalSolved: 'desc' } },
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      leetcodeUsername: user.leetcodeUsername,
      avatar: user.avatar || '',
      totalSolved: user.leetcodeStats?.totalSolved || 0,
      easySolved: user.leetcodeStats?.easySolved || 0,
      mediumSolved: user.leetcodeStats?.mediumSolved || 0,
      hardSolved: user.leetcodeStats?.hardSolved || 0,
      contestRating: user.leetcodeStats?.contestRating || 0,
      globalRanking: user.leetcodeStats?.globalRanking || 0,
    }));

    res.json({ college, leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
