const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipientPhone: {
      type: String,
      required: true,
    },
    recipientName: {
      type: String,
      default: '',
    },
    channel: {
      type: String,
      enum: ['WhatsApp', 'SMS', 'Fallback Broadcast Log'],
      default: 'WhatsApp',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Sent', 'Delivered', 'Logged for Batch SMS', 'Failed'],
      default: 'Sent',
    },
    matchedWithCount: {
      type: Number,
      default: 1,
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);

module.exports = NotificationLog;
