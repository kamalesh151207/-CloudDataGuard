const mongoose = require('mongoose');

let connectionMetrics = {
  isConnected: false,
  isInMemory: false,
  host: null,
  databaseName: null,
  lastCheck: new Date(),
  connectionAttempts: 0,
  latencyMs: 0
};

const connectDB = async () => {
  connectionMetrics.connectionAttempts += 1;
  const startTime = Date.now();
  const uri = process.env.MONGODB_URI;

  try {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    connectionMetrics.isConnected = true;
    connectionMetrics.isInMemory = false;
    connectionMetrics.host = conn.connection.host;
    connectionMetrics.databaseName = conn.connection.name;
    connectionMetrics.latencyMs = Date.now() - startTime;
    connectionMetrics.lastCheck = new Date();

    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Atlas Warning] Failed to connect to target URI (${error.message}). Initiating fallback memory server...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      connectionMetrics.isConnected = true;
      connectionMetrics.isInMemory = true;
      connectionMetrics.host = 'In-Memory MongoDB Engine (Fallback)';
      connectionMetrics.databaseName = conn.connection.name;
      connectionMetrics.latencyMs = Date.now() - startTime;
      connectionMetrics.lastCheck = new Date();

      console.log(`[MongoDB Connected] Fallback memory database active at: ${mongoUri}`);
      return conn;
    } catch (memError) {
      connectionMetrics.isConnected = false;
      connectionMetrics.latencyMs = Date.now() - startTime;
      connectionMetrics.lastCheck = new Date();
      console.error(`[MongoDB Error] Failed to establish database connection:`, memError.message);
      process.exit(1);
    }
  }
};

const getDBHealth = async () => {
  const startTime = Date.now();
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  let pingTime = 0;
  if (state === 1) {
    try {
      await mongoose.connection.db.admin().ping();
      pingTime = Date.now() - startTime;
    } catch (e) {
      pingTime = -1;
    }
  }

  connectionMetrics.lastCheck = new Date();
  connectionMetrics.latencyMs = pingTime >= 0 ? pingTime : connectionMetrics.latencyMs;

  return {
    status: state === 1 ? 'Operational' : 'Degraded',
    state: states[state] || 'Unknown',
    readyStateCode: state,
    isConnected: state === 1,
    isInMemory: connectionMetrics.isInMemory,
    host: connectionMetrics.host || 'Unknown',
    databaseName: connectionMetrics.databaseName || 'cloud_data_guard',
    latencyMs: pingTime,
    lastCheck: connectionMetrics.lastCheck,
    connectionAttempts: connectionMetrics.connectionAttempts
  };
};

module.exports = {
  connectDB,
  getDBHealth,
  connectionMetrics
};
