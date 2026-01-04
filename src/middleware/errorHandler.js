/**
 * Global error handling middleware
 */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method
  });

  // PostgreSQL errors
  if (err.code === '23505') {
    error.message = 'Duplicate field value entered';
    error.statusCode = 409;
  }

  if (err.code === '23503') {
    error.message = 'Foreign key constraint violation';
    error.statusCode = 400;
  }

  if (err.code === '22P02') {
    error.message = 'Invalid input syntax';
    error.statusCode = 400;
  }

  // JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error.message = 'Invalid JSON';
    error.statusCode = 400;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
  }

  // Development vs production error response
  const response = {
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    response.error.details = err;
  }

  res.status(error.statusCode).json(response);
};

// Handle unhandled promise rejections
const unhandledRejectionHandler = (server) => {
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', err);
    server.close(() => {
      process.exit(1);
    });
  });
};

// Handle uncaught exceptions
const uncaughtExceptionHandler = () => {
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
  });
};

module.exports = {
  errorHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler
};
