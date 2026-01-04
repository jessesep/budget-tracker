/**
 * 404 handler for undefined routes
 */

const { NotFoundError } = require('../utils/errors');

const notFound = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};

module.exports = notFound;
