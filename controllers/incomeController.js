const Income = require('../models/Income');

exports.createIncome = async (req, res) => {
  try {
    const {
      description, // required
      incomeType, // required
      amount, // required
      currency,
      exchangeRate,
      dateReceived, // required
      taxYear,
      isTaxable,
      taxWithheld,
      source,
      paymentMethod,
      notes,
      receiptUrl
    } = req.body;

    // test =  {
    //   "description": "Freelance website build for Acme",
    //   "incomeType": "freelance",
    //   "amount": 1200,
    //   "currency": "USD",
    //   "exchangeRate": 760,          // numeric, used to compute amountInNaira
    //   "dateReceived": "2025-01-15", // ISO date string
    //   "taxYear": 2025,
    //   "isTaxable": true,
    //   "taxWithheld": 0,
    //   "source": { "name": "Acme Ltd", "type": "client" },
    //   "paymentMethod": "bank_transfer",
    //   "notes": "Project completed, invoice #123",
    //   "receiptUrl": "https://example.com/receipt.jpg"
    // }

    // Validate required fields
    if (!description || !incomeType || !amount || !dateReceived) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: description, incomeType, amount, dateReceived'
      });
    }

    // // For demo: userId from request body (in production, get from auth middleware)
    // const userId = req.body.userId;
    // if (!userId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'userId is required'
    //   });
    // }

    const userId = req.session.userId;
    // Create income entry
    const income = await Income.create({
      userId,
      description,
      incomeType,
      amount,
      currency: currency || 'NGN',
      exchangeRate: exchangeRate || 1,
      dateReceived,
      taxYear: taxYear || new Date().getFullYear(),
      isTaxable: isTaxable !== undefined ? isTaxable : true,
      taxWithheld: taxWithheld || 0,
      source,
      paymentMethod,
      notes,
      receiptUrl
    });

    res.status(201).json({
      success: true,
      message: 'Income entry created successfully',
      data: income
    });

  } catch (error) {
    console.error('Create Income Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating income entry',
      error: error.message
    });
  }
};

// This request supports optional query parameters for filtering: ?taxYear=&month=&incomeType=&startDate=&endDate=
// @desc    Get all income entries for a user
// @route   GET /api/income/:userId
// @access  Private
exports.getIncomeByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { taxYear, month, incomeType, startDate, endDate } = req.query;
    
    // Build query
    let query = { userId };

    if (taxYear) query.taxYear = parseInt(taxYear);
    if (month) query.month = parseInt(month);
    if (incomeType) query.incomeType = incomeType;
    
    if (startDate && endDate) {
      query.dateReceived = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const incomes = await Income.find(query)
      .sort({ dateReceived: -1 })
      .lean();

    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amountInNaira, 0);
    const totalTaxWithheld = incomes.reduce((sum, income) => sum + income.taxWithheld, 0);

    res.status(200).json({
      success: true,
      count: incomes.length,
      totalIncome,
      totalTaxWithheld,
      data: incomes
    });

  } catch (error) {
    console.error('Get Income Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching income entries',
      error: error.message
    });
  }
};

// @desc    Get income summary by tax year
// @route   GET /api/income/:userId/summary/:taxYear
// @access  Private
// exports.getIncomeSummary = async (req, res) => {
//   try {
//     const { userId, taxYear } = req.params;

//     const summary = await Income.aggregate([
//       {
//         $match: {
//           userId: require('mongoose').Types.ObjectId(userId),
//           taxYear: parseInt(taxYear)
//         }
//       },
//       {
//         $group: {
//           _id: '$incomeType',
//           totalAmount: { $sum: '$amountInNaira' },
//           count: { $sum: 1 },
//           totalTaxWithheld: { $sum: '$taxWithheld' }
//         }
//       },
//       {
//         $sort: { totalAmount: -1 }
//       }
//     ]);

//     // Calculate grand totals
//     const grandTotal = summary.reduce((sum, item) => sum + item.totalAmount, 0);
//     const totalWithheld = summary.reduce((sum, item) => sum + item.totalTaxWithheld, 0);

//     res.status(200).json({
//       success: true,
//       taxYear: parseInt(taxYear),
//       grandTotal,
//       totalWithheld,
//       netIncome: grandTotal - totalWithheld,
//       breakdown: summary
//     });

//   } catch (error) {
//     console.error('Get Income Summary Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching income summary',
//       error: error.message
//     });
//   }
// };


exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await Income.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income entry updated successfully',
      data: income
    });

  } catch (error) {
    console.error('Update Income Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating income entry',
      error: error.message
    });
  }
};

// @desc    Delete income entry
// @route   DELETE /api/income/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await Income.findByIdAndDelete(id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete Income Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting income entry',
      error: error.message
    });
  }
};