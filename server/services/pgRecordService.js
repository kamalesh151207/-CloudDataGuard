const { pool } = require('../config/supabasePg');

/**
 * Normalization helper functions
 */
const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

const normalizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

/**
 * Log activity event into Supabase PostgreSQL
 */
const logPgActivity = async (eventType, status, description, metadata = {}) => {
  try {
    await pool.query(
      `INSERT INTO activity_logs (event_type, status, description, metadata) VALUES ($1, $2, $3, $4)`,
      [eventType, status, description, JSON.stringify(metadata)]
    );
  } catch (err) {
    console.error('Failed to log PG activity:', err.message);
  }
};

/**
 * Validate a record payload against Supabase PostgreSQL
 */
const validateRecordPg = async (recordData) => {
  const { name, email, phone, department = 'Engineering' } = recordData;

  const rawEmail = email ? email.trim() : '';
  const rawPhone = phone ? phone.trim() : '';
  const rawName = name ? name.trim() : '';

  // 1. Schema Validation (False Positive Detection)
  if (!rawName) {
    return {
      isValid: false,
      isRedundant: false,
      status: 'invalid',
      reason: 'INVALID: Full Name is required.',
      normalizedData: { email: rawEmail, phone: rawPhone }
    };
  }

  if (!isValidEmail(rawEmail)) {
    return {
      isValid: false,
      isRedundant: false,
      status: 'invalid',
      reason: 'INVALID: Email address is malformed or invalid.',
      normalizedData: { email: rawEmail, phone: rawPhone }
    };
  }

  if (!isValidPhone(rawPhone)) {
    return {
      isValid: false,
      isRedundant: false,
      status: 'invalid',
      reason: 'INVALID: Phone number must contain between 7 and 15 digits.',
      normalizedData: { email: rawEmail, phone: rawPhone }
    };
  }

  // 2. Normalization
  const normEmail = normalizeEmail(rawEmail);
  const normPhone = normalizePhone(rawPhone);

  // 3. Multi-level Duplicate Detection against Supabase PostgreSQL
  const checkQuery = `
    SELECT * FROM records 
    WHERE normalized_email = $1 OR normalized_phone = $2 
    LIMIT 5
  `;
  const existingRes = await pool.query(checkQuery, [normEmail, normPhone]);
  const existing = existingRes.rows;

  if (existing.length > 0) {
    let exactMatch = null;
    let emailCollision = null;
    let phoneCollision = null;

    for (const rec of existing) {
      const recEmailMatch = rec.normalized_email === normEmail;
      const recPhoneMatch = rec.normalized_phone === normPhone;
      const recNameMatch = rec.name.trim().toLowerCase() === rawName.toLowerCase();

      if (recEmailMatch && recPhoneMatch && recNameMatch) {
        exactMatch = rec;
        break;
      } else if (recEmailMatch && recPhoneMatch) {
        exactMatch = rec;
      } else if (recEmailMatch) {
        emailCollision = rec;
      } else if (recPhoneMatch) {
        phoneCollision = rec;
      }
    }

    if (exactMatch) {
      return {
        isValid: true,
        isRedundant: true,
        status: 'redundant',
        reason: `DUPLICATE (Level 1): Exact record collision with existing record ID [${exactMatch.record_id}].`,
        conflictingRecord: exactMatch,
        normalizedData: { email: normEmail, phone: normPhone }
      };
    }

    if (emailCollision) {
      return {
        isValid: true,
        isRedundant: true,
        status: 'redundant',
        reason: `DUPLICATE (Level 2 Email Collision): Normalized email '${normEmail}' already exists under record ID [${emailCollision.record_id}].`,
        conflictingRecord: emailCollision,
        normalizedData: { email: normEmail, phone: normPhone }
      };
    }

    if (phoneCollision) {
      return {
        isValid: true,
        isRedundant: true,
        status: 'redundant',
        reason: `DUPLICATE (Level 3 Phone Collision): Normalized phone digits '${normPhone}' already exist under record ID [${phoneCollision.record_id}].`,
        conflictingRecord: phoneCollision,
        normalizedData: { email: normEmail, phone: normPhone }
      };
    }
  }

  // Record is unique & verified
  return {
    isValid: true,
    isRedundant: false,
    status: 'unique',
    reason: 'UNIQUE & VERIFIED: Record passed schema validation and 3-level duplicate check.',
    normalizedData: { email: normEmail, phone: normPhone }
  };
};

/**
 * Insert record into Supabase PostgreSQL
 */
const insertRecordPg = async (recordData) => {
  const validationResult = await validateRecordPg(recordData);

  if (!validationResult.isValid) {
    await logPgActivity(
      'RECORD_REJECTED_INVALID',
      'invalid',
      `Record creation failed: ${validationResult.reason}`,
      { input: recordData }
    );
    const err = new Error(validationResult.reason);
    err.statusCode = 400;
    err.validationResult = validationResult;
    throw err;
  }

  if (validationResult.isRedundant) {
    await logPgActivity(
      'RECORD_REJECTED_DUPLICATE',
      'redundant',
      `Record blocked by redundancy prevention engine: ${validationResult.reason}`,
      { input: recordData, conflictingRecordId: validationResult.conflictingRecord?.record_id }
    );
    const err = new Error(validationResult.reason);
    err.statusCode = 409; // Conflict
    err.validationResult = validationResult;
    throw err;
  }

  const { name, email, phone, department = 'Engineering' } = recordData;
  const normEmail = normalizeEmail(email);
  const normPhone = normalizePhone(phone);
  const recordId = `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  try {
    const insertQuery = `
      INSERT INTO records (record_id, name, email, phone, normalized_email, normalized_phone, department, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'verified')
      RETURNING *
    `;
    const res = await pool.query(insertQuery, [
      recordId,
      name.trim(),
      email.trim(),
      phone.trim(),
      normEmail,
      normPhone,
      department
    ]);

    const newRecord = res.rows[0];

    await logPgActivity(
      'RECORD_INSERTED',
      'verified',
      `Unique record successfully appended to Supabase PostgreSQL [${newRecord.record_id}]`,
      { recordId: newRecord.record_id, email: normEmail, department }
    );

    return {
      record: newRecord,
      validationResult
    };
  } catch (dbError) {
    // Unique constraint violation (code 23505 in PostgreSQL)
    if (dbError.code === '23505') {
      await logPgActivity(
        'RECORD_REJECTED_UNIQUE_INDEX',
        'redundant',
        `Database-level unique constraint blocked duplicate insertion for email [${normEmail}] / phone [${normPhone}]`,
        { email: normEmail, phone: normPhone }
      );
      const err = new Error('DUPLICATE (Database Index): A record with this email or phone number already exists in Supabase PostgreSQL.');
      err.statusCode = 409;
      throw err;
    }
    throw dbError;
  }
};

/**
 * Get Paginated Records from Supabase PostgreSQL
 */
const getRecordsPg = async ({ search, status, department, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' }) => {
  let whereClauses = [];
  let queryParams = [];
  let paramIdx = 1;

  if (search) {
    whereClauses.push(`(name ILIKE $${paramIdx} OR email ILIKE $${paramIdx} OR phone ILIKE $${paramIdx} OR record_id ILIKE $${paramIdx})`);
    queryParams.push(`%${search}%`);
    paramIdx++;
  }

  if (status && status !== 'all') {
    whereClauses.push(`status = $${paramIdx}`);
    queryParams.push(status);
    paramIdx++;
  }

  if (department && department !== 'all') {
    whereClauses.push(`department = $${paramIdx}`);
    queryParams.push(department);
    paramIdx++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Count total records
  const countRes = await pool.query(`SELECT COUNT(*) FROM records ${whereSql}`, queryParams);
  const total = parseInt(countRes.rows[0].count, 10);

  // Paginated Data
  const offset = (page - 1) * limit;
  const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const dataRes = await pool.query(
    `SELECT * FROM records ${whereSql} ORDER BY ${sortBy} ${orderDirection} LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
    [...queryParams, limit, offset]
  );

  return {
    records: dataRes.rows,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

/**
 * Get Stats Dashboard Metrics from Supabase PostgreSQL
 */
const getStatsPg = async () => {
  const totalRecordsRes = await pool.query(`SELECT COUNT(*) FROM records`);
  const totalRecords = parseInt(totalRecordsRes.rows[0].count, 10);

  const uniqueRecordsRes = await pool.query(`SELECT COUNT(*) FROM records WHERE status = 'verified' OR status = 'unique'`);
  const uniqueRecords = parseInt(uniqueRecordsRes.rows[0].count, 10);

  const redundantRes = await pool.query(`SELECT COUNT(*) FROM activity_logs WHERE status = 'redundant'`);
  const redundantAttempts = parseInt(redundantRes.rows[0].count, 10);

  const invalidRes = await pool.query(`SELECT COUNT(*) FROM activity_logs WHERE status = 'invalid'`);
  const invalidAttempts = parseInt(invalidRes.rows[0].count, 10);

  const totalEvaluated = uniqueRecords + redundantAttempts + invalidAttempts;
  const dataQualityScore = totalEvaluated > 0 ? ((uniqueRecords / totalEvaluated) * 100).toFixed(1) : 100.0;

  // Department breakdown
  const deptRes = await pool.query(`SELECT department, COUNT(*) as count FROM records GROUP BY department`);
  const departmentBreakdown = {};
  deptRes.rows.forEach(r => {
    departmentBreakdown[r.department] = parseInt(r.count, 10);
  });

  return {
    totalRecords,
    uniqueRecords,
    redundantAttempts,
    invalidAttempts,
    totalEvaluated,
    dataQualityScore: Number(dataQualityScore),
    departmentBreakdown,
    activeDatabase: 'Supabase PostgreSQL'
  };
};

module.exports = {
  validateRecordPg,
  insertRecordPg,
  getRecordsPg,
  getStatsPg,
  logPgActivity
};
