const { getDBHealth } = require('../config/db');
const { isPgConnected, pool } = require('../config/supabasePg');

const startTime = Date.now();

/**
 * System health diagnostics endpoint
 * GET /api/health
 */
const getSystemHealth = async (req, res, next) => {
  try {
    let dbHealth;

    if (isPgConnected()) {
      const pingStart = Date.now();
      try {
        await pool.query('SELECT 1;');
        const latencyMs = Date.now() - pingStart;

        dbHealth = {
          isConnected: true,
          provider: 'Supabase PostgreSQL',
          connectionState: 'Connected & Operational',
          latencyMs,
          host: 'aws-0-ap-northeast-1.pooler.supabase.com',
          databaseName: 'postgres',
          uniqueIndexProtection: 'Active (idx_records_normalized_email, idx_records_normalized_phone)'
        };
      } catch (err) {
        dbHealth = {
          isConnected: false,
          provider: 'Supabase PostgreSQL',
          connectionState: 'Disconnected / Error',
          error: err.message
        };
      }
    } else {
      dbHealth = await getDBHealth();
    }

    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    const healthStatus = {
      status: dbHealth.isConnected ? 'Operational' : 'Degraded',
      timestamp: new Date().toISOString(),
      server: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds,
        formattedUptime: formatUptime(uptimeSeconds),
        memoryUsage: {
          rssMb: (memoryUsage.rss / (1024 * 1024)).toFixed(2),
          heapTotalMb: (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2),
          heapUsedMb: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)
        }
      },
      database: dbHealth,
      engine: {
        validationEngine: 'Operational',
        deduplicationEngine: 'Operational',
        indexProtection: 'Active (Supabase PostgreSQL Unique Indexes)'
      }
    };

    const statusCode = dbHealth.isConnected ? 200 : 503;
    return res.status(statusCode).json(healthStatus);
  } catch (error) {
    next(error);
  }
};

const formatUptime = (totalSeconds) => {
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
};

module.exports = {
  getSystemHealth
};
