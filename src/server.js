/**
 * Server entry point
 */

require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const {
  unhandledRejectionHandler,
  uncaughtExceptionHandler
} = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Handle unhandled rejections and uncaught exceptions
unhandledRejectionHandler(server);
uncaughtExceptionHandler();

module.exports = server;
