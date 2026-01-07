
const express = require('express');
const router = express.Router();
const {
  createIncome,
  getIncomeByUser,
  getIncomeSummary,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');

// Create new income entry
router.post('/', createIncome);

// Get all income entries for a user (with optional filters)
router.get('/:userId', getIncomeByUser);

// Get income summary by tax year
router.get('/:userId/summary/:taxYear', getIncomeSummary);

// Update income entry
router.put('/:id', updateIncome);

// Delete income entry
router.delete('/:id', deleteIncome);

module.exports = router;
