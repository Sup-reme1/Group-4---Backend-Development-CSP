const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  
  // Tax Information
  taxIdentificationNumber: {
    type: String,
    sparse: true,
    trim: true
  },
  
  // Location (for State-specific filing)
  stateOfResidence: {
    type: String,
    required: [true, 'State of residence is required'],
    enum: [
      'Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Delta', 'Kaduna',
      'Anambra', 'Edo', 'Enugu', 'Imo', 'Ogun', 'Plateau', 'Cross River',
      'Bauchi', 'Benue', 'Borno', 'Ekiti', 'Gombe', 'Jigawa', 'Kebbi',
      'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Ondo', 'Osun', 'Sokoto',
      'Taraba', 'Yobe', 'Zamfara', 'Abia', 'Adamawa', 'Akwa Ibom', 'Bayelsa', 'Ebonyi'
    ]
  },
  
  // Employment Status
  employmentType: {
    type: String,
    required: true,
    enum: ['freelancer', 'salaried', 'business_owner', 'mixed'],
    default: 'freelancer'
  },
  
  // Tax Year Tracking
  activeTaxYear: {
    type: Number,
    default: 2025
  },
  
  // 2025 Tax Relief Settings
  taxReliefSettings: {
    consolidatedReliefAllowance: {
      type: Number,
      default: 200000
    },
    dependentsCount: {
      type: Number,
      default: 0,
      max: 4
    }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ stateOfResidence: 1 });
userSchema.index({ activeTaxYear: 1 });

module.exports =
  mongoose.models.TaxProfile ||
  mongoose.model('TaxProfile', userSchema);
