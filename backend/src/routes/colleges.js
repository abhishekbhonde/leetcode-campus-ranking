const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(colleges);
  } catch (error) {
    console.error('Colleges error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
