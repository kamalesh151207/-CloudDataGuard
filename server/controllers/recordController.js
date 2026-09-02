const Record = require('../models/Record');
const ActivityLog = require('../models/ActivityLog');
const { validateAndClassifyRecord } = require('../services/validationService');
const { isPgConnected } = require('../config/supabasePg');
const { 
  validateRecordPg, 
  insertRecordPg, 
  getRecordsPg, 
  getStatsPg 
} = require('../services/pgRecordService');
const {
  loadRecords,
  addRecord,
  loadLogs,
  addLog
} = require('../services/persistentStore');

/**
 * Validate a record without saving to database
 * POST /api/records/validate
 */
const validateRecord = async (req, res, next) => {
  try {
    const inputData = req.body;

    if (isPgConnected()) {
      try {
        const pgResult = await validateRecordPg(inputData);
        return res.status(200).json({
          success: true,
          status: pgResult.status,
          message: pgResult.reason,
          reason: pgResult.reason,
          canInsert: !pgResult.isRedundant && pgResult.isValid,
          normalizedData: pgResult.normalizedData,
          conflictingRecord: pgResult.conflictingRecord
        });
      } catch (e) {
        console.warn('PG validation fallback to local engine:', e.message);
      }
    }

    const classification = await validateAndClassifyRecord(inputData);

    // Audit log
    addLog({
      eventType: 'RECORD_VALIDATED',
      status: classification.status,
      description: `Validation performed for ${inputData.email || 'record'}: ${classification.message}`,
      metadata: { email: inputData.email, phone: inputData.phone, reason: classification.reason, ip: req.ip }
    });

    return res.status(200).json(classification);
  } catch (error) {
    next(error);
  }
};

/**
 * Insert a verified record into database with disk persistence
 * POST /api/records
 */
const insertRecord = async (req, res, next) => {
  try {
    const inputData = req.body;

    // Try Supabase PostgreSQL first if connected
    if (isPgConnected()) {
      try {
        const { record, validationResult } = await insertRecordPg(inputData);
        // Persist to local disk backup as well
        addRecord({
          _id: record.record_id || record.id?.toString(),
          recordId: record.record_id,
          name: record.name,
          email: record.email,
          normalizedEmail: record.normalized_email,
          phone: record.phone,
          normalizedPhone: record.normalized_phone,
          department: record.department,
          status: 'verified',
          createdAt: record.created_at
        });

        return res.status(201).json({
          success: true,
          status: 'verified',
          message: 'Unique record successfully stored in Supabase PostgreSQL database.',
          data: record
        });
      } catch (pgError) {
        if (pgError.statusCode) {
          return res.status(pgError.statusCode).json({
            success: false,
            status: pgError.validationResult?.status || 'redundant',
            message: pgError.message,
            reason: pgError.message,
            canInsert: false
          });
        }
        console.warn('PG insertion error, executing persistent store fallback:', pgError.message);
      }
    }

    // Validation check
    const classification = await validateAndClassifyRecord(inputData);

    if (!classification.canInsert) {
      addLog({
        eventType: classification.status === 'redundant' ? 'DUPLICATE_REJECTED' : 'INVALID_REJECTED',
        status: classification.status,
        description: `Insertion blocked: ${classification.message}`,
        metadata: { email: inputData.email, phone: inputData.phone, reason: classification.reason, ip: req.ip }
      });

      return res.status(400).json({
        success: false,
        status: classification.status,
        message: classification.message,
        reason: classification.reason,
        errors: classification.errors,
        canInsert: false
      });
    }

    const { normalizedData } = classification;

    try {
      // Add to persistent disk store
      const persistentRec = addRecord({
        name: normalizedData.name,
        email: normalizedData.email,
        normalizedEmail: normalizedData.normalizedEmail,
        phone: normalizedData.phone,
        normalizedPhone: normalizedData.normalizedPhone,
        department: normalizedData.department,
        location: normalizedData.location,
        status: 'verified'
      });

      // Also create in Mongoose if connected
      await Record.create({
        name: normalizedData.name,
        email: normalizedData.email,
        normalizedEmail: normalizedData.normalizedEmail,
        phone: normalizedData.phone,
        normalizedPhone: normalizedData.normalizedPhone,
        department: normalizedData.department,
        location: normalizedData.location,
        status: 'verified',
        validationReason: 'Record is unique and verified.'
      }).catch(err => console.warn('Mongoose sync warning:', err.message));

      addLog({
        eventType: 'UNIQUE_RECORD_INSERTED',
        status: 'verified',
        description: `Unique record successfully stored for ${persistentRec.name} (${persistentRec.email}).`,
        metadata: { recordId: persistentRec._id, email: persistentRec.email, phone: persistentRec.phone, ip: req.ip }
      });

      return res.status(201).json({
        success: true,
        status: 'verified',
        message: 'Unique record successfully stored in cloud database.',
        data: persistentRec
      });
    } catch (dbError) {
      if (dbError.statusCode === 409) {
        return res.status(409).json({
          success: false,
          status: 'redundant',
          message: 'Redundant Record Blocked by Database Security Index.',
          reason: dbError.message,
          canInsert: false
        });
      }
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all records with pagination, search, filter, and sort
 * GET /api/records
 */
const getRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { search, status, department, sortBy = 'createdAt', order = 'desc' } = req.query;

    if (isPgConnected()) {
      try {
        const pgRes = await getRecordsPg({
          search,
          status,
          department,
          page,
          limit,
          sortBy: sortBy === 'createdAt' ? 'created_at' : sortBy,
          sortOrder: order
        });
        if (pgRes.records.length > 0) {
          return res.status(200).json({
            success: true,
            data: pgRes.records.map(r => ({
              _id: r.id.toString(),
              recordId: r.record_id,
              name: r.name,
              email: r.email,
              phone: r.phone,
              normalizedEmail: r.normalized_email,
              normalizedPhone: r.normalized_phone,
              department: r.department,
              status: r.status,
              createdAt: r.created_at,
              updatedAt: r.updated_at
            })),
            pagination: {
              totalRecords: pgRes.pagination.total,
              totalPages: pgRes.pagination.totalPages,
              currentPage: pgRes.pagination.page,
              limit: pgRes.pagination.limit,
              hasNextPage: pgRes.pagination.page < pgRes.pagination.totalPages,
              hasPrevPage: pgRes.pagination.page > 1
            }
          });
        }
      } catch (e) {
        console.warn('PG fetch error, falling back to persistent store:', e.message);
      }
    }

    // Disk Persistent Fallback
    let allRecords = loadRecords();

    if (status && status !== 'all') {
      allRecords = allRecords.filter(r => r.status === status);
    }
    if (department && department !== 'all') {
      allRecords = allRecords.filter(r => r.department === department);
    }
    if (search) {
      const q = search.trim().toLowerCase();
      allRecords = allRecords.filter(r => 
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.department?.toLowerCase().includes(q) ||
        r.recordId?.toLowerCase().includes(q)
      );
    }

    const totalRecords = allRecords.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = allRecords.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get record detail by ID
 * GET /api/records/:id
 */
const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allRecords = loadRecords();
    const record = allRecords.find(r => r._id === id || r.recordId === id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found.'
      });
    }

    const allLogs = loadLogs();
    const history = allLogs.filter(l => l.metadata?.recordId === id || l.metadata?.email === record.email);

    return res.status(200).json({
      success: true,
      data: {
        ...record,
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dynamic dashboard statistics & analytics
 * GET /api/records/stats
 */
const getStats = async (req, res, next) => {
  try {
    if (isPgConnected()) {
      try {
        const pgStats = await getStatsPg();
        if (pgStats.totalRecords > 0) {
          return res.status(200).json({
            success: true,
            stats: {
              totalRecords: pgStats.totalRecords,
              uniqueRecords: pgStats.uniqueRecords,
              redundantAttempts: pgStats.redundantAttempts,
              invalidAttempts: pgStats.invalidAttempts,
              totalAttempts: pgStats.totalEvaluated,
              dataQualityScore: pgStats.dataQualityScore,
              redundancyPercentage: pgStats.totalEvaluated > 0 ? parseFloat(((pgStats.redundantAttempts / pgStats.totalEvaluated) * 100).toFixed(1)) : 0,
              validationSuccessRate: pgStats.totalEvaluated > 0 ? parseFloat(((pgStats.uniqueRecords / pgStats.totalEvaluated) * 100).toFixed(1)) : 100,
              activeDatabase: 'Supabase PostgreSQL'
            },
            departmentBreakdown: Object.keys(pgStats.departmentBreakdown).map(k => ({ name: k, count: pgStats.departmentBreakdown[k] })),
            activityTrend: [],
            duplicateReasons: []
          });
        }
      } catch (e) {
        console.warn('PG stats fetch fallback:', e.message);
      }
    }

    const allRecords = loadRecords();
    const allLogs = loadLogs();

    const verifiedCount = allRecords.filter(r => r.status === 'verified').length;
    const redundantLogsCount = allLogs.filter(l => l.status === 'redundant' || l.eventType === 'DUPLICATE_REJECTED').length;
    const invalidLogsCount = allLogs.filter(l => l.status === 'invalid' || l.eventType === 'INVALID_REJECTED').length;

    const totalRecords = allRecords.length;
    const totalAttempts = totalRecords + redundantLogsCount + invalidLogsCount;

    let qualityScore = 100.0;
    if (totalAttempts > 0) {
      qualityScore = parseFloat(((verifiedCount / totalAttempts) * 100).toFixed(1));
    }

    const deptCounts = {};
    allRecords.forEach(r => {
      const d = r.department || 'Engineering';
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalRecords,
        uniqueRecords: verifiedCount,
        redundantAttempts: redundantLogsCount,
        invalidAttempts: invalidLogsCount,
        totalAttempts,
        dataQualityScore: qualityScore,
        redundancyPercentage: totalAttempts > 0 ? parseFloat(((redundantLogsCount / totalAttempts) * 100).toFixed(1)) : 0,
        validationSuccessRate: totalAttempts > 0 ? parseFloat(((verifiedCount / totalAttempts) * 100).toFixed(1)) : 100
      },
      departmentBreakdown: Object.keys(deptCounts).map(name => ({ name, count: deptCounts[name] })),
      activityTrend: [],
      duplicateReasons: []
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateRecord,
  insertRecord,
  getRecords,
  getRecordById,
  getStats
};
