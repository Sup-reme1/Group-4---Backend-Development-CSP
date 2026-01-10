const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
function isAuth(req, res, next) {
    if (!req.session.userId) return res.redirect('/users/login');
    next();
}

router.get('/', isAuth, async (req, res) => {
    try {
        res.status(200).json({ 'message': 'Income added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Failed to add income' });
    }
});

module.exports = router;