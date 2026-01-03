const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
        res.redirect('/users/login');

    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'Something went wrong. Try again.' });
    }
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

        // Redirect to dashboard/home
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Something went wrong. Try again.' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.clearCookie('connect.sid');
        res.redirect('/users/login');
    });
});

module.exports = router;
