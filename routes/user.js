const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
    res.render('signup');
});

// POST Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render('signup', { error: 'Email already registered' });
        }

        // Create new user
        const user = new User({ name, email, password });
        await user.save(); // password is hashed automatically

        // Redirect to login page after signup
        res.status(200).json({ 'message': 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Something went wrong. Try again.' });
    }
});


router.get('/login', (req, res) => {
    res.render('login');
});
// POST Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.render('login', { error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render('login', { error: 'Invalid credentials' });

        // Save user session
        req.session.userId = user._id;

        res.status(200).json({ 'message': 'Login successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Something went wrong. Try again.' });
    }
});

// Update User Info
router.put('/update/:id', (req, res) => {
  try {
    const user = User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tax profile',
      error: error.message
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.clearCookie('connect.sid');
        // res.redirect('/users/login');
    });
});

module.exports = router;
