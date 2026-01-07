const TaxProfile = require('../models/TaxProfile');

// @desc    Create Tax Profile
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      taxIdentificationNumber,
      stateOfResidence,
      employmentType
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !stateOfResidence) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: fullName, email, phoneNumber, stateOfResidence'
      });
    }

    // Check if tax profile already exists
    const existingUser = await TaxProfile.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Tax profile with this email already exists'
      });
    }

    // Create tax profile
    const user = await TaxProfile.create({
      fullName,
      email,
      phoneNumber,
      taxIdentificationNumber,
      stateOfResidence,
      employmentType: employmentType || 'freelancer'
    });

    res.status(201).json({
      success: true,
      message: 'Tax profile created successfully',
      data: user
    });
  } catch (error) {
    console.error('Create Tax Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating tax profile',
      error: error.message
    });
  }
};

// @desc    Get tax profile by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await TaxProfile.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tax profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get Tax Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tax profile',
      error: error.message
    });
  }
};

// @desc    Get all tax profiles
// @route   GET /api/users
// @access  Public
exports.getAllUsers = async (req, res) => {
  try {
    const users = await TaxProfile.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get Tax Profiles Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tax profiles',
      error: error.message
    });
  }
};

// @desc    Update tax profile
// @route   PUT /api/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
  try {
    const user = await TaxProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tax profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tax profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update Tax Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tax profile',
      error: error.message
    });
  }
};

// @desc    Delete tax profile
// @route   DELETE /api/users/:id
// @access  Public
exports.deleteUser = async (req, res) => {
  try {
    const user = await TaxProfile.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tax profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tax profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete Tax Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tax profile',
      error: error.message
    });
  }
};
