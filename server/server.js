const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const recordRoutes = require('./routes/recordRoutes');
const activityRoutes = require('./routes/activityRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Security Middleware
app.use(helmet());

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy restriction'));
      }
    },
    credentials: true,
  })
);

// Rate Limiting to protect API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api/', limiter);

// Request Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/health', healthRoutes);

// Root Status Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'CloudDataGuard API Engine',
    tagline: 'Validate. Deduplicate. Trust Your Data.',
    status: 'Operational',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Central Error Handler
app.use(errorHandler);

// Start Server & Connect Database
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 CloudDataGuard API Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=================================================`);
    });
  });
}

module.exports = app;
