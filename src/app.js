/**
 * Express app configuration
 */

const express = require('express');
const cors = require('cors');
const budgetRoutes = require('./routes/budgetRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/budgets', budgetRoutes);

// 404 handler - must come after all routes
app.use(notFound);

// Global error handler - must come last
app.use(errorHandler);

module.exports = app;
