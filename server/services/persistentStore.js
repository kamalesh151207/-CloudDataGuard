const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const recordsFile = path.join(dataDir, 'persistentRecords.json');
const logsFile = path.join(dataDir, 'persistentLogs.json');

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure records file exists
if (!fs.existsSync(recordsFile)) {
  fs.writeFileSync(recordsFile, JSON.stringify([], null, 2));
}

// Ensure logs file exists
if (!fs.existsSync(logsFile)) {
  fs.writeFileSync(logsFile, JSON.stringify([], null, 2));
}

const loadRecords = () => {
  try {
    const raw = fs.readFileSync(recordsFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const saveRecords = (records) => {
  try {
    fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2));
  } catch (e) {
    console.error('Failed to save persistent records:', e);
  }
};

const addRecord = (record) => {
  const records = loadRecords();
  // Check for duplicate by email or phone
  const normEmail = record.normalizedEmail || record.email?.toLowerCase().trim();
  const normPhone = record.normalizedPhone || record.phone?.replace(/\D/g, '');

  const existingEmail = records.find(r => (r.normalizedEmail || r.email?.toLowerCase().trim()) === normEmail);
  if (existingEmail) {
    const err = new Error('Record with this email already exists in persistent database.');
    err.statusCode = 409;
    err.validationResult = { status: 'redundant' };
    throw err;
  }

  const existingPhone = records.find(r => (r.normalizedPhone || r.phone?.replace(/\D/g, '')) === normPhone);
  if (existingPhone && normPhone && normPhone.length > 5) {
    const err = new Error('Record with this phone number already exists in persistent database.');
    err.statusCode = 409;
    err.validationResult = { status: 'redundant' };
    throw err;
  }

  const newRec = {
    _id: record._id || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recordId: record.recordId || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: record.name,
    email: record.email,
    normalizedEmail: normEmail,
    phone: record.phone,
    normalizedPhone: normPhone,
    department: record.department || 'Engineering',
    location: record.location || 'Remote',
    status: record.status || 'verified',
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  records.unshift(newRec);
  saveRecords(records);
  return newRec;
};

const loadLogs = () => {
  try {
    const raw = fs.readFileSync(logsFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const addLog = (log) => {
  const logs = loadLogs();
  const newLog = {
    _id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventType: log.eventType || 'SYSTEM_EVENT',
    status: log.status || 'info',
    description: log.description,
    metadata: log.metadata || {},
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  try {
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));
  } catch (e) {}
  return newLog;
};

module.exports = {
  loadRecords,
  saveRecords,
  addRecord,
  loadLogs,
  addLog
};
