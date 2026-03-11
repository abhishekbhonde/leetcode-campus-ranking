const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { fetchLeetCodeStats } = require('../services/leetcode');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, collegeId, leetcodeUsername } = req.body;

    if (!name || !email || !password || !collegeId || !leetcodeUsername) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        collegeId: parseInt(collegeId),
        leetcodeUsername,
      },
    });

    // Fetch initial LeetCode stats
    const stats = await fetchLeetCodeStats(leetcodeUsername);
    await prisma.leetcodeStats.create({
      data: {
        userId: user.id,
        ...stats,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        leetcodeUsername: user.leetcodeUsername,
        collegeId: user.collegeId,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { college: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        leetcodeUsername: user.leetcodeUsername,
        collegeId: user.collegeId,
        collegeName: user.college.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
