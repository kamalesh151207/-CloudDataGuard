const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    normalizedEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    normalizedPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      default: 'General',
      trim: true,
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    status: {
      type: String,
      enum: ['verified', 'redundant', 'invalid'],
      default: 'verified',
    },
    validationReason: {
      type: String,
      default: 'Record is unique and verified.',
    },
    matchingField: {
      type: String,
      default: null,
    },
    existingRecordRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Record',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick full match checks
recordSchema.index({ normalizedEmail: 1, normalizedPhone: 1 });

module.exports = mongoose.model('Record', recordSchema);
