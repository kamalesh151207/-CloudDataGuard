const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const { connectDB } = require('../config/db');
const Record = require('../models/Record');
const ActivityLog = require('../models/ActivityLog');
const { normalizeEmail, normalizePhone, formatTitleCase } = require('../services/validationService');

const sampleVerifiedRecords = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@techcorp.io',
    phone: '+91 98765 43210',
    department: 'Engineering',
    location: 'Bangalore, India',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@cloudsystems.net',
    phone: '+91 98123 45678',
    department: 'Cloud Security',
    location: 'Hyderabad, India',
  },
  {
    name: 'Alex Mercer',
    email: 'alex.mercer@dataops.org',
    phone: '+1 415 555 0199',
    department: 'Data Engineering',
    location: 'San Francisco, USA',
  },
  {
    name: 'Anita Desai',
    email: 'anita.desai@enterprisecorp.com',
    phone: '+91 97654 32109',
    department: 'DevOps',
    location: 'Mumbai, India',
  },
  {
    name: 'David Chen',
    email: 'david.chen@cybernode.io',
    phone: '+1 650 555 0142',
    department: 'Infrastructure',
    location: 'Seattle, USA',
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@analytica.ai',
    phone: '+91 99887 76655',
    department: 'AI & Analytics',
    location: 'Pune, India',
  },
  {
    name: 'Michael Vance',
    email: 'michael.vance@cloudsecure.com',
    phone: '+44 20 7946 0912',
    department: 'Security Operations',
    location: 'London, UK',
  },
  {
    name: 'Kavita Menon',
    email: 'kavita.menon@fintechcloud.com',
    phone: '+91 94433 22110',
    department: 'Compliance & Data Quality',
    location: 'Chennai, India',
  }
];

const sampleRejectedAttempts = [
  {
    email: 'RAHUL.KUMAR@TECHCORP.IO',
    phone: '9876543210',
    reason: "Email 'rahul.kumar@techcorp.io' already exists in cloud database.",
    status: 'redundant'
  },
  {
    email: 'priya.sharma@cloudsystems.net',
    phone: '9812345678',
    reason: "Phone number '9812345678' already registered to existing record.",
    status: 'redundant'
  },
  {
    email: 'invalid-email-format@',
    phone: '9876543210',
    reason: 'Email format is invalid (missing top-level domain).',
    status: 'invalid'
  },
  {
    email: 'test@invalidphone',
    phone: '123',
    reason: 'Phone number must contain at least 10 digits.',
    status: 'invalid'
  }
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing demo records and activity logs...');
    await Record.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('[Seed] Inserting Verified Records...');
    for (const item of sampleVerifiedRecords) {
      const normEmail = normalizeEmail(item.email);
      const normPhone = normalizePhone(item.phone);

      const record = await Record.create({
        name: formatTitleCase(item.name),
        email: item.email.trim(),
        normalizedEmail: normEmail,
        phone: item.phone.trim(),
        normalizedPhone: normPhone,
        department: formatTitleCase(item.department),
        location: formatTitleCase(item.location),
        status: 'verified',
        validationReason: 'Record is unique and verified.'
      });

      await ActivityLog.create({
        eventType: 'UNIQUE_RECORD_INSERTED',
        status: 'verified',
        description: `Seed: Unique verified record inserted for ${record.name} (${record.email}).`,
        metadata: {
          recordId: record._id.toString(),
          email: record.email,
          phone: record.phone
        }
      });
    }

    console.log('[Seed] Logging sample duplicate & invalid rejection attempts...');
    for (const attempt of sampleRejectedAttempts) {
      await ActivityLog.create({
        eventType: attempt.status === 'redundant' ? 'DUPLICATE_REJECTED' : 'INVALID_REJECTED',
        status: attempt.status,
        description: `Seed Audit: ${attempt.reason}`,
        metadata: {
          email: attempt.email,
          phone: attempt.phone,
          reason: attempt.reason
        }
      });
    }

    console.log('✅ Seed script executed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed script error:', error);
    process.exit(1);
  }
};

seedDatabase();
