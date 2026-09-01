const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: [
        'RECORD_VALIDATED',
        'UNIQUE_RECORD_INSERTED',
        'DUPLICATE_REJECTED',
        'INVALID_REJECTED',
        'DATABASE_CONNECTED',
        'SYSTEM_HEALTH_CHECK'
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['verified', 'redundant', 'invalid', 'unique', 'info', 'warning'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      email: String,
      phone: String,
      recordId: String,
      reason: String,
      ip: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
