const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// router.get('/signup', (req, res) => {
//     res.render('signup');
// });

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


// router.get('/login', (req, res) => {
//     res.render('login');
// });
// POST Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(500).json({ 'message': 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(500).json({ 'message': 'Invalid credentials' });

        // Save user session
        req.session.userId = user._id;
        req.session.save(err => {
          if (err) console.error('Session save error:', err);
          console.log('User logged in, session saved:', req.session);
          res.set('Set-Cookie', `session=${req.sessionID}; HttpOnly; SameSite=None; Secure`);
          return res.status(200).json({ message: 'Login successful' });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Something went wrong. Try again.' });
    }
});

// Update User Info
router.put('/update/:id', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Request body is missing' });
    }

    const updateData = req.body;

    // If password is being updated, load the document and save to trigger pre-save hooks (e.g., hashing)
    let user;
    if (updateData.password) {
      user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
      Object.keys(updateData).forEach(key => {
        user[key] = updateData[key];
      });
      await user.save();
    } else {
      user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, message: 'Profile updated successfully'});
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Error updating tax profile', error: error.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: 'Logged out' });
    });
});

// Debug session (dev only)
router.get('/session', (req, res) => {
  res.json({ session: req.session, cookies: req.headers.cookie || null });
});

module.exports = router;
