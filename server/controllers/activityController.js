const ActivityLog = require('../models/ActivityLog');

/**
 * Get system activity logs
 * GET /api/activity
 */
const getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { status, eventType } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (eventType && eventType !== 'all') {
      query.eventType = eventType;
    }

    const totalLogs = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        totalLogs,
        totalPages: Math.ceil(totalLogs / limit) || 1,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs
};
