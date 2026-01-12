
const express = require('express');
const router = express.Router();
const {
  createIncome,
  getIncomeByUser,
  getIncomeSummary,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');

// Middleware to check if user is authenticated
function isAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  next();
}

// Create new income entry
router.post('/', isAuth, createIncome);

// Get all income entries for a user (with optional filters)
// This request supports optional query parameters for filtering: ?taxYear=&month=&incomeType=&startDate=&endDate=
router.get('/:userId', isAuth, getIncomeByUser);

// Get income summary by tax year
// router.get('/:userId/summary/:taxYear', isAuth, getIncomeSummary);

// Update income entry
router.put('/:id', isAuth, updateIncome);

// Delete income entry
router.delete('/:id', isAuth, deleteIncome);

module.exports = router;
