const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        'Page_View',
        'Form_Step_Completed',
        'Registration_Success',
        'UPI_QR_Clicked',
        'WhatsApp_Share_Clicked',
        'Chat_Opened',
        'Feedback_Submitted',
      ],
      index: true,
    },
    city: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    deviceType: {
      type: String,
      enum: ['Mobile', 'Desktop', 'Tablet', 'Unknown'],
      default: 'Unknown',
    },
    stepNumber: {
      type: Number,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // Capped/TTL index could be used, or standard timestamps
    timestamps: true,
  }
);

// Compound index for fast funnel conversion queries
eventLogSchema.index({ eventType: 1, createdAt: -1 });

const EventLog = mongoose.model('EventLog', eventLogSchema);

module.exports = EventLog;
