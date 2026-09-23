const User = require('../models/User');
const Feedback = require('../models/Feedback');
const EventLog = require('../models/EventLog');
const { sanitizeUserDto, sanitizeMatchedUsersList } = require('../utils/privacyDto');

/**
 * @desc    Get currently logged-in user profile with privacy-masked matches
 * @route   GET /api/user/profile
 * @access  Private (Protected by JWT)
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -reports -blockedUsers')
      .populate('matchedWith', 'fullName phone gender city area garbaStyle socialProfile matchStatus');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Convert to object
    const userObj = user.toObject();

    // Mask phone numbers of matched partners for privacy
    if (userObj.matchedWith && Array.isArray(userObj.matchedWith)) {
      userObj.matchedWith = sanitizeMatchedUsersList(userObj.matchedWith);
    }

    return res.status(200).json({
      success: true,
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a specific user's public profile (strictly masked)
 * @route   GET /api/user/:id
 * @access  Private
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await User.findById(id).select('-password');

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isSelf = targetUser._id.toString() === req.user._id.toString();
    const sanitized = sanitizeUserDto(targetUser, isSelf);

    return res.status(200).json({
      success: true,
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit user feedback / feature suggestion / venue request
 * @route   POST /api/user/feedback
 * @access  Private (Protected by JWT)
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { category, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a feedback message.',
      });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      userPhone: req.user.phone,
      userName: req.user.fullName,
      category: category || 'General',
      message: message.trim(),
      city: req.user.city || 'Gujarat',
    });

    // Log telemetry event
    await EventLog.create({
      eventType: 'Feedback_Submitted',
      city: req.user.city || 'Gujarat',
      metadata: { category: feedback.category },
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback! Jay Mataji 🌸',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getUserById,
  submitFeedback,
};
