const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { redirectIfAuthenticated, JWT_SECRET } = require('../middleware/auth');

// Renders the Login page
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', { title: 'Sign In' });
});

// Renders the Register page
router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('register', { title: 'Sign Up' });
});

// API registration handler (AJAX fetch style)
router.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || username.trim() === '' || password.trim() === '') {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const userExists = await User.findOne({ username: username.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ error: 'Username already taken.' });
    }

    const newUser = new User({
      username: username.toLowerCase().trim(),
      password
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Database or server error.' });
  }
});

// API login handler (AJAX fetch style)
router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || username.trim() === '' || password.trim() === '') {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database or server error.' });
  }
});

// Logout page/endpoint
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
