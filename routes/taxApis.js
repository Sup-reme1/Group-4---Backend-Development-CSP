const express = require('express');
const router = express.Router();
const TaxService = require('../TaxEngine/taxCalculator');
const { isAuth } = require('../middleware/auth');

router.get('/', isAuth, async (req, res) => {
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