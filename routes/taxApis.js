const express = require('express');
const router = express.Router();
const TaxService = require('../TaxEngine/taxCalculator');

// Middleware to check if user is authenticated
function isAuth(req, res, next) {
    if (!req.session.userId) return res.redirect('/users/login');
    next();
}

router.get('/calculateTax', async (req, res) => {
    try {
        const { grossIncome, actualRent, otherDeductions } = req.body;
        const result = TaxService.calculateAnnualTax({
            grossIncome: parseFloat(grossIncome),
            actualRent: parseFloat(actualRent),
            otherDeductions: parseFloat(otherDeductions)
        });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Error calculating tax', 'error': err.message });
    }
});

module.exports = router;