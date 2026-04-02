const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { user_id: user.user_id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /auth/me - to get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.user_id });
    res.json({ user: { user_id: user.user_id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;