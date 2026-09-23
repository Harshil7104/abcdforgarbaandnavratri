const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    userPhone: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: 'Anonymous',
    },
    category: {
      type: String,
      required: true,
      enum: ['Feature Request', 'Venue Suggestion', 'Bug Report', 'General'],
      default: 'General',
    },
    message: {
      type: String,
      required: [true, 'Feedback message cannot be empty'],
      trim: true,
      maxlength: [1000, 'Feedback message cannot exceed 1000 characters'],
    },
    city: {
      type: String,
      default: 'Gujarat',
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Implemented'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
