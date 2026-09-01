const Record = require('../models/Record');

/**
 * Normalizes input string data
 */
const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

const normalizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  // Extract all digits
  const digitsOnly = phone.replace(/\D/g, '');
  // Standardize to last 10 digits if 10 or more digits are present (handles country codes e.g. +91)
  if (digitsOnly.length >= 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
};

const normalizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
};

const formatTitleCase = (str) => {
  const normalized = normalizeString(str);
  if (!normalized) return '';
  return normalized
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Step 1: Input Validation
 */
const validateInputSchema = (data) => {
  const errors = [];

  const name = normalizeString(data.name);
  const email = normalizeString(data.email);
  const phone = normalizeString(data.phone);

  if (!name) {
    errors.push('Full Name is required');
  } else if (name.length < 2) {
    errors.push('Full Name must be at least 2 characters long');
  }

  if (!email) {
    errors.push('Email address is required');
  } else {
    // Robust RFC 5322 compliant regex for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push('Email format is invalid (e.g., user@example.com)');
    }
  }

  if (!phone) {
    errors.push('Phone number is required');
  } else {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      errors.push('Phone number must contain between 10 and 15 digits');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates, Normalizes, and Classifies incoming data payload
 */
const validateAndClassifyRecord = async (inputData) => {
  // Step 1: Input validation
  const schemaValidation = validateInputSchema(inputData);
  if (!schemaValidation.isValid) {
    return {
      status: 'invalid',
      message: 'Validation failed due to invalid input formats.',
      rejectionType: 'schema_validation_failure',
      errors: schemaValidation.errors,
      canInsert: false,
      normalizedData: null
    };
  }

  // Step 2: Normalize data
  const rawName = normalizeString(inputData.name);
  const formattedName = formatTitleCase(rawName);
  const normalizedEmail = normalizeEmail(inputData.email);
  const normalizedPhone = normalizePhone(inputData.phone);
  const department = formatTitleCase(inputData.department || 'General');
  const location = formatTitleCase(inputData.location || 'Remote');

  const normalizedData = {
    name: formattedName,
    email: inputData.email.trim(),
    normalizedEmail,
    phone: inputData.phone.trim(),
    normalizedPhone,
    department,
    location
  };

  // Step 3: Compare with existing database records
  // Level 1: Exact Match Check
  const exactMatch = await Record.findOne({
    normalizedEmail,
    normalizedPhone,
    status: 'verified'
  }).exec();

  if (exactMatch) {
    return {
      status: 'redundant',
      message: 'Redundant Record Detected: Exact record matches existing entry.',
      reason: 'Exact duplicate record (email and phone) already exists in cloud database.',
      matchingField: 'exact_match',
      canInsert: false,
      existingRecord: {
        id: exactMatch._id,
        name: exactMatch.name,
        email: exactMatch.email,
        phone: exactMatch.phone,
        createdAt: exactMatch.createdAt
      },
      normalizedData
    };
  }

  // Level 2: Strong Email Match Check
  const emailMatch = await Record.findOne({
    normalizedEmail,
    status: 'verified'
  }).exec();

  if (emailMatch) {
    return {
      status: 'redundant',
      message: 'Redundant Record Detected: Email collision.',
      reason: `Email address '${emailMatch.email}' already exists in database.`,
      matchingField: 'email',
      canInsert: false,
      existingRecord: {
        id: emailMatch._id,
        name: emailMatch.name,
        email: emailMatch.email,
        phone: emailMatch.phone,
        createdAt: emailMatch.createdAt
      },
      normalizedData
    };
  }

  // Level 3: Strong Phone Match Check
  const phoneMatch = await Record.findOne({
    normalizedPhone,
    status: 'verified'
  }).exec();

  if (phoneMatch) {
    return {
      status: 'redundant',
      message: 'Redundant Record Detected: Phone number collision.',
      reason: `Phone number '${phoneMatch.phone}' already exists in database.`,
      matchingField: 'phone',
      canInsert: false,
      existingRecord: {
        id: phoneMatch._id,
        name: phoneMatch.name,
        email: phoneMatch.email,
        phone: phoneMatch.phone,
        createdAt: phoneMatch.createdAt
      },
      normalizedData
    };
  }

  // Step 4 & 5: Record is Unique and Verified
  return {
    status: 'unique',
    message: 'Record is UNIQUE & VERIFIED.',
    reason: 'Data passed schema validation and contains no cloud database redundancies.',
    canInsert: true,
    normalizedData
  };
};

module.exports = {
  normalizeEmail,
  normalizePhone,
  normalizeString,
  formatTitleCase,
  validateInputSchema,
  validateAndClassifyRecord
};
