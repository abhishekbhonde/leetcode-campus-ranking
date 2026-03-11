const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/profile — authenticated user's profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        college: true,
        leetcodeStats: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Calculate college rank
    const collegeUsers = await prisma.user.findMany({
      where: { collegeId: user.collegeId },
      include: { leetcodeStats: true },
      orderBy: { leetcodeStats: { totalSolved: 'desc' } },
    });

    const rank = collegeUsers.findIndex((u) => u.id === user.id) + 1;

    const { password, ...userData } = user;
    res.json({ ...userData, collegeRank: rank, totalInCollege: collegeUsers.length });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        college: true,
        leetcodeStats: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
