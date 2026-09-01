const Record = require('../models/Record');
const ActivityLog = require('../models/ActivityLog');
const { validateAndClassifyRecord } = require('../services/validationService');

/**
 * Validate a record without saving to database
 * POST /api/records/validate
 */
const validateRecord = async (req, res, next) => {
  try {
    const inputData = req.body;
    const classification = await validateAndClassifyRecord(inputData);

    // Create activity log entry for audit trail
    await ActivityLog.create({
      eventType: 'RECORD_VALIDATED',
      status: classification.status,
      description: `Validation performed for ${inputData.email || 'record'}: ${classification.message}`,
      metadata: {
        email: inputData.email,
        phone: inputData.phone,
        reason: classification.reason || classification.errors?.join(', '),
        ip: req.ip
      }
    }).catch(err => console.error('Failed to save activity log:', err));

    return res.status(200).json(classification);
  } catch (error) {
    next(error);
  }
};

/**
 * Insert a verified record into database
 * POST /api/records
 */
const insertRecord = async (req, res, next) => {
  try {
    const inputData = req.body;

    // Perform validation check
    const classification = await validateAndClassifyRecord(inputData);

    if (!classification.canInsert) {
      // Log rejected insertion attempt
      await ActivityLog.create({
        eventType: classification.status === 'redundant' ? 'DUPLICATE_REJECTED' : 'INVALID_REJECTED',
        status: classification.status,
        description: `Insertion blocked: ${classification.message}`,
        metadata: {
          email: inputData.email,
          phone: inputData.phone,
          reason: classification.reason || classification.errors?.join(', '),
          ip: req.ip
        }
      }).catch(err => console.error('Failed to log rejected insertion:', err));

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

    // Database level atomic insertion attempt with unique index safety
    try {
      const newRecord = await Record.create({
        name: normalizedData.name,
        email: normalizedData.email,
        normalizedEmail: normalizedData.normalizedEmail,
        phone: normalizedData.phone,
        normalizedPhone: normalizedData.normalizedPhone,
        department: normalizedData.department,
        location: normalizedData.location,
        status: 'verified',
        validationReason: 'Record is unique and verified.'
      });

      // Audit Log
      await ActivityLog.create({
        eventType: 'UNIQUE_RECORD_INSERTED',
        status: 'verified',
        description: `Unique record successfully stored for ${newRecord.name} (${newRecord.email}).`,
        metadata: {
          recordId: newRecord._id.toString(),
          email: newRecord.email,
          phone: newRecord.phone,
          ip: req.ip
        }
      }).catch(err => console.error('Failed to log record insertion:', err));

      return res.status(201).json({
        success: true,
        status: 'verified',
        message: 'Unique record successfully stored in cloud database.',
        data: newRecord
      });
    } catch (dbError) {
      // Catch MongoDB Duplicate Key Error (Code 11000)
      if (dbError.code === 11000) {
        const duplicateField = Object.keys(dbError.keyPattern || {})[0] || 'unique field';
        const friendlyField = duplicateField.includes('Email') ? 'Email' : 'Phone Number';

        await ActivityLog.create({
          eventType: 'DUPLICATE_REJECTED',
          status: 'redundant',
          description: `Concurrent database collision blocked by unique index (${friendlyField}).`,
          metadata: { email: inputData.email, phone: inputData.phone, ip: req.ip }
        }).catch(err => console.error('Failed to log duplicate key collision:', err));

        return res.status(409).json({
          success: false,
          status: 'redundant',
          message: 'Redundant Record Blocked by Database Security Index.',
          reason: `${friendlyField} collision occurred during concurrent request processing.`,
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
    const skip = (page - 1) * limit;

    const { search, status, department, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { department: searchRegex },
        { location: searchRegex }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const totalRecords = await Record.countDocuments(query);
    const records = await Record.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return res.status(200).json({
      success: true,
      data: records,
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
    const record = await Record.findById(id).select('-__v').lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found.'
      });
    }

    // Find related activity logs for validation history
    const logs = await ActivityLog.find({
      $or: [
        { 'metadata.recordId': id },
        { 'metadata.email': record.email }
      ]
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...record,
        history: logs
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
    const verifiedCount = await Record.countDocuments({ status: 'verified' });
    
    // Count activity logs for total validation attempts, redundant attempts, invalid attempts
    const totalValidatedLogs = await ActivityLog.countDocuments({ eventType: 'RECORD_VALIDATED' });
    const redundantLogsCount = await ActivityLog.countDocuments({
      $or: [
        { status: 'redundant' },
        { eventType: 'DUPLICATE_REJECTED' }
      ]
    });
    const invalidLogsCount = await ActivityLog.countDocuments({
      $or: [
        { status: 'invalid' },
        { eventType: 'INVALID_REJECTED' }
      ]
    });

    const totalRecords = await Record.countDocuments();
    
    // Total processed attempts (records + rejected logs)
    const totalAttempts = totalRecords + redundantLogsCount + invalidLogsCount;

    // Calculate Data Quality Score dynamically from actual database stats
    // Quality Score = (Unique Verified Records / Total Evaluated Data Points) * 100
    let qualityScore = 100.0;
    if (totalAttempts > 0) {
      qualityScore = parseFloat(((verifiedCount / totalAttempts) * 100).toFixed(1));
    }

    // Department breakdown using Mongoose Aggregation
    const departmentStats = await Record.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Validation activity trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const activityTrend = await ActivityLog.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    // Top duplicate field collision breakdown
    const duplicateReasons = await ActivityLog.aggregate([
      { $match: { status: 'redundant' } },
      {
        $group: {
          _id: '$metadata.reason',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

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
      departmentBreakdown: departmentStats.map(d => ({ name: d._id || 'Unassigned', count: d.count })),
      activityTrend,
      duplicateReasons: duplicateReasons.map(r => ({ reason: r._id || 'Duplicate Field Collision', count: r.count }))
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
