/**
 * Production Central Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid record identifier format.',
      error: 'Malformed parameter ID'
    });
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Data schema validation failed.',
      errors: messages
    });
  }

  // Handle MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const key = Object.keys(err.keyPattern || {})[0] || 'unique field';
    return res.status(409).json({
      success: false,
      status: 'redundant',
      message: 'Duplicate key collision detected.',
      reason: `Record with matching ${key} already exists in database.`
    });
  }

  // Default Production Error Response
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An internal cloud server error occurred.' : err.message,
    status: 'error'
  });
};

module.exports = errorHandler;
