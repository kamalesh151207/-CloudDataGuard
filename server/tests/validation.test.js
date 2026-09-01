const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Record = require('../models/Record');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Record.deleteMany({});
});

describe('CloudDataGuard Validation & Duplicate Detection Suite', () => {

  // Test 1: New unique record -> ACCEPT
  test('Test 1: New unique record is ACCEPTED and verified', async () => {
    const payload = {
      name: 'Rahul Kumar',
      email: 'rahul.kumar@techcorp.io',
      phone: '+91 98765 43210',
      department: 'Engineering',
      location: 'Bangalore'
    };

    const valRes = await request(app)
      .post('/api/records/validate')
      .send(payload);

    expect(valRes.status).toBe(200);
    expect(valRes.body.status).toBe('unique');
    expect(valRes.body.canInsert).toBe(true);

    const insertRes = await request(app)
      .post('/api/records')
      .send(payload);

    expect(insertRes.status).toBe(201);
    expect(insertRes.body.success).toBe(true);
    expect(insertRes.body.data.status).toBe('verified');
  });

  // Test 2: Exact duplicate -> REJECT
  test('Test 2: Exact duplicate record is REJECTED', async () => {
    const payload = {
      name: 'Rahul Kumar',
      email: 'rahul@gmail.com',
      phone: '9876543210',
      department: 'Engineering',
      location: 'Delhi'
    };

    // Insert first record
    await request(app).post('/api/records').send(payload);

    // Attempt second exact insert
    const duplicateRes = await request(app)
      .post('/api/records/validate')
      .send(payload);

    expect(duplicateRes.status).toBe(200);
    expect(duplicateRes.body.status).toBe('redundant');
    expect(duplicateRes.body.canInsert).toBe(false);

    const postAttempt = await request(app)
      .post('/api/records')
      .send(payload);

    expect(postAttempt.status).toBe(400);
    expect(postAttempt.body.status).toBe('redundant');
  });

  // Test 3: Duplicate with uppercase email -> REJECT
  test('Test 3: Duplicate with uppercase email is REJECTED', async () => {
    const initialPayload = {
      name: 'Rahul Kumar',
      email: 'rahul@gmail.com',
      phone: '9876543210'
    };
    await request(app).post('/api/records').send(initialPayload);

    const uppercasePayload = {
      name: 'RAHUL KUMAR',
      email: 'RAHUL@GMAIL.COM',
      phone: '9876543210'
    };

    const valRes = await request(app)
      .post('/api/records/validate')
      .send(uppercasePayload);

    expect(valRes.body.status).toBe('redundant');
    expect(valRes.body.canInsert).toBe(false);
  });

  // Test 4: Duplicate with extra whitespace -> REJECT
  test('Test 4: Duplicate with extra whitespace is REJECTED', async () => {
    const initialPayload = {
      name: 'Rahul Kumar',
      email: 'rahul@gmail.com',
      phone: '9876543210'
    };
    await request(app).post('/api/records').send(initialPayload);

    const whitespacePayload = {
      name: '   Rahul Kumar   ',
      email: '   rahul@gmail.com   ',
      phone: '  9876543210  '
    };

    const valRes = await request(app)
      .post('/api/records/validate')
      .send(whitespacePayload);

    expect(valRes.body.status).toBe('redundant');
    expect(valRes.body.canInsert).toBe(false);
  });

  // Test 5: Existing phone number -> FLAG/REJECT
  test('Test 5: Existing phone number collision is REJECTED', async () => {
    const firstPayload = {
      name: 'User One',
      email: 'user1@company.com',
      phone: '+91 98765 43210'
    };
    await request(app).post('/api/records').send(firstPayload);

    const secondPayloadDifferentEmail = {
      name: 'User Two',
      email: 'user2@company.com', // Different email
      phone: '9876543210' // Same normalized phone
    };

    const valRes = await request(app)
      .post('/api/records/validate')
      .send(secondPayloadDifferentEmail);

    expect(valRes.body.status).toBe('redundant');
    expect(valRes.body.matchingField).toBe('phone');
    expect(valRes.body.reason).toContain('Phone number');
  });

  // Test 6: Invalid email -> INVALID
  test('Test 6: Invalid email format returns INVALID', async () => {
    const invalidEmailPayload = {
      name: 'Kamalesh',
      email: 'kamalesh@',
      phone: '9876543210'
    };

    const valRes = await request(app)
      .post('/api/records/validate')
      .send(invalidEmailPayload);

    expect(valRes.body.status).toBe('invalid');
    expect(valRes.body.canInsert).toBe(false);
    expect(valRes.body.errors).toBeDefined();
    expect(valRes.body.errors.some(e => e.includes('Email format is invalid'))).toBe(true);
  });

  // Test 7: Invalid phone -> INVALID
  test('Test 7: Invalid phone number format returns INVALID', async () => {
    const invalidPhonePayload = {
      name: 'Kamalesh',
      email: 'kamalesh@gmail.com',
      phone: '12345' // Under 10 digits
    };

    const valRes = await request(app)
      .post('/api/records/validate')
      .send(invalidPhonePayload);

    expect(valRes.body.status).toBe('invalid');
    expect(valRes.body.canInsert).toBe(false);
    expect(valRes.body.errors.some(e => e.includes('10 and 15 digits'))).toBe(true);
  });

  // Test 8: Two simultaneous insertion attempts -> only one unique record inserted
  test('Test 8: Concurrent insertion attempts guarantee only one insertion', async () => {
    const payload = {
      name: 'Concurrent User',
      email: 'concurrent@cloud.io',
      phone: '9988776655'
    };

    // Execute 2 parallel POST /api/records calls
    const results = await Promise.all([
      request(app).post('/api/records').send(payload),
      request(app).post('/api/records').send(payload)
    ]);

    const statusCodes = results.map(r => r.status);
    // One must be 201 Created and the other 400 or 409
    expect(statusCodes).toContain(201);
    expect(statusCodes.some(code => code === 400 || code === 409)).toBe(true);

    // Verify only 1 record in database
    const dbCount = await Record.countDocuments({ normalizedEmail: 'concurrent@cloud.io' });
    expect(dbCount).toBe(1);
  });

});
