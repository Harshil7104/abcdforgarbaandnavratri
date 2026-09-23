const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token for an authenticated user
 * @param {string} id - User ObjectId
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      password,
      gender,
      city,
      area,
      garbaStyle,
      groupSize,
      nightAvailability,
      socialProfile,
    } = req.body;

    // Check if phone number is provided and if user already exists
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number.',
      });
    }

    const existingUser = await User.findOne({ phone: phone.trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this phone number already exists.',
      });
    }

    // Create user in database
    const user = await User.create({
      fullName,
      phone: phone.trim(),
      password,
      gender,
      city: city || 'Vadodara',
      area,
      garbaStyle,
      groupSize,
      nightAvailability: nightAvailability || ['All 9 Nights'],
      socialProfile,
    });

    // Generate authentication token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Welcome to Find My Garba Partner!',
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          phone: user.phone,
          gender: user.gender,
          city: user.city,
          area: user.area,
          garbaStyle: user.garbaStyle,
          groupSize: user.groupSize,
          nightAvailability: user.nightAvailability,
          socialProfile: user.socialProfile,
          role: user.role,
          matchStatus: user.matchStatus,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Validate inputs
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both phone number and password.',
      });
    }

    // Check for user and explicitly select password field
    const user = await User.findOne({ phone: phone.trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password.',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          phone: user.phone,
          gender: user.gender,
          city: user.city,
          area: user.area,
          garbaStyle: user.garbaStyle,
          groupSize: user.groupSize,
          nightAvailability: user.nightAvailability,
          socialProfile: user.socialProfile,
          role: user.role,
          matchStatus: user.matchStatus,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
