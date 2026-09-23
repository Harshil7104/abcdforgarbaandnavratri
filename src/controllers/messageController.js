const Message = require('../models/Message');
const User = require('../models/User');

/**
 * @desc    Get messages between logged-in user and matched user
 * @route   GET /api/messages/:matchId
 * @access  Private
 */
const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { matchId } = req.params;

    if (!matchId) {
      return res.status(400).json({
        success: false,
        message: 'Match ID is required.',
      });
    }

    // Retrieve conversation history between the two users
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: matchId },
        { senderId: matchId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      { senderId: matchId, receiverId: currentUserId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send a message to a matched user
 * @route   POST /api/messages/send
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { receiverId, matchId, text } = req.body;

    if (!receiverId || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and non-empty message text are required.',
      });
    }

    // Check if either user has blocked the other
    const recipient = await User.findById(receiverId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found.',
      });
    }

    if (recipient.blockedUsers && recipient.blockedUsers.includes(senderId)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot send messages to this user.',
      });
    }

    // Create message record
    const message = await Message.create({
      senderId,
      receiverId,
      matchId: matchId || receiverId,
      text: text.trim(),
      read: false,
    });

    // If socket.io is available, broadcast message to receiver's personal room
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiverId}`).emit('new_message', message);
      io.to(`chat_${matchId}`).emit('chat_message', message);
    }

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Report / Block a user
 * @route   POST /api/messages/report
 * @access  Private
 */
const reportUser = async (req, res, next) => {
  try {
    const reporterId = req.user._id;
    const { targetUserId, reason, blockUser } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required.',
      });
    }

    // Add report to target user
    await User.findByIdAndUpdate(targetUserId, {
      $push: {
        reports: {
          reportedBy: reporterId,
          reason: reason || 'Inappropriate behavior in chat',
          createdAt: new Date(),
        },
      },
    });

    // Optionally add to reporter's blocked list
    if (blockUser) {
      await User.findByIdAndUpdate(reporterId, {
        $addToSet: { blockedUsers: targetUserId },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User report submitted successfully. Our safety team has been alerted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  sendMessage,
  reportUser,
};
