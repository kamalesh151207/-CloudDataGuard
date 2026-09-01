const { Client, Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.SUPABASE_PG_URI || "postgresql://postgres.cxccxrxicnmnnybobhvh:DE-ZC-e62yRR!f-@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

// Prevent background pool errors from crashing process
pool.on('error', (err) => {
  console.warn('⚠️ Supabase PG Pool Background Warning:', err.message);
});

let isPgConnected = false;

// Table & Schema Initialization Script
const initPgSchema = async () => {
  let client;
  try {
    console.log('📦 Connecting to Supabase PostgreSQL Database...');
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000
    });

    await client.connect();

    // Create Records Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        record_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        normalized_email VARCHAR(255) NOT NULL,
        normalized_phone VARCHAR(50) NOT NULL,
        department VARCHAR(100) NOT NULL DEFAULT 'Engineering',
        status VARCHAR(50) NOT NULL DEFAULT 'verified',
        duplicate_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Sparse Unique Indexes for 0-Redundancy Guarantee
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_records_normalized_email ON records (normalized_email);
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_records_normalized_phone ON records (normalized_phone);
    `);

    // Create Activity Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        metadata JSONB,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    isPgConnected = true;
    console.log('✅ Supabase PostgreSQL Schema & Indexes Initialized (records, activity_logs)');
  } catch (error) {
    console.warn('⚠️ Supabase PostgreSQL Connection Warning:', error.message);
    isPgConnected = false;
  } finally {
    if (client) {
      try { await client.end(); } catch (e) {}
    }
  }
};

module.exports = {
  pool,
  initPgSchema,
  isPgConnected: () => isPgConnected
};
