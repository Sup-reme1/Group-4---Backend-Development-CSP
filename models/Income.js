const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
    
  // Income Type
  incomeType: {
    type: String,
    required: true,
    enum: [
      'salary',
      'freelance',
      'business',
      'rental',
      'investment',
      'commission',
      'bonus',
      'other'
    ]
  },
    
  // Amount & Currency
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },

  currency: {
    type: String,
    required: true,
    enum: ['NGN', 'USD', 'GBP', 'EUR'],
    default: 'NGN'
  },
  
  // Date Information
  dateReceived: {
    type: Date,
    required: [true, 'Date received is required'],
    index: true
  },
  
   // Client Name
  clientName: {
    type: String,
    required: true
  },

  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'paypal', 'stripe', 'payoneer', 'cryptocurrency', 'other']
  },

  // Receipt/Invoice
  receiptUrl: {
    type: String
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }

  // exchangeRate: {
  //   type: Number,
  //   default: 1
  // },

  // Income Details
  // description: {
  //   type: String,
  //   required: [true, 'Income description is required'],
  //   trim: true
  // },

  // amountInNaira: {
  //   type: Number
  // },
  
  // month: {
  //   type: Number,
  //   min: 1,
  //   max: 12
  // },
  // year: {
  //   type: Number,
  //   index: true
  // },

  // taxYear: {
  //   type: Number,
  //   default: 2025
  // },
  
  // Tax Information
  // isTaxable: {
  //   type: Boolean,
  //   default: true
  // },
  // taxWithheld: {
  //   type: Number,
  //   default: 0,
  //   min: 0
  // },
  
  // Source Information
  // source: {
  //   name: String,
  //   type: {
  //     type: String,
  //     enum: ['employer', 'client', 'platform', 'other']
  //   }
  // },
  
  
  // Notes
  // notes: {
  //   type: String,
  //   trim: true
  // },
  
  
  // Status
  // isVerified: {
  //   type: Boolean,
  //   default: false
  // },
  
}, {
  timestamps: true
});

// Indexes
incomeSchema.index({ userId: 1, taxYear: 1 });
incomeSchema.index({ userId: 1, dateReceived: -1 });
incomeSchema.index({ userId: 1, incomeType: 1 });

// Pre-save middleware to calculate values
incomeSchema.pre('save', function(next) {
  // Calculate Naira amount
  this.amountInNaira = this.amount * (this.exchangeRate || 1);
  
  // Extract month and year from dateReceived
  if (this.dateReceived) {
    const date = new Date(this.dateReceived);
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }
  
  // Set default taxYear if not provided
  if (!this.taxYear) {
    this.taxYear = this.year || new Date().getFullYear();
  }
  
});

module.exports = mongoose.models.Income || mongoose.model('Income', incomeSchema);