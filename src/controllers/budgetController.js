/**
 * Budget controller with error handling examples
 */

const asyncHandler = require('../middleware/asyncHandler');
const { ValidationError, NotFoundError, DatabaseError } = require('../utils/errors');

// Mock database for demonstration
const mockDb = {
  budgets: [
    { id: 1, name: 'Monthly Budget', amount: 5000, category: 'general' },
    { id: 2, name: 'Groceries', amount: 500, category: 'food' }
  ]
};

/**
 * @route   GET /api/budgets
 * @desc    Get all budgets
 * @access  Public
 */
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = mockDb.budgets;

  res.status(200).json({
    success: true,
    count: budgets.length,
    data: budgets
  });
});

/**
 * @route   GET /api/budgets/:id
 * @desc    Get budget by ID
 * @access  Public
 */
const getBudgetById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (isNaN(id)) {
    throw new ValidationError('Budget ID must be a number');
  }

  const budget = mockDb.budgets.find(b => b.id === parseInt(id));

  if (!budget) {
    throw new NotFoundError(`Budget with ID ${id} not found`);
  }

  res.status(200).json({
    success: true,
    data: budget
  });
});

/**
 * @route   POST /api/budgets
 * @desc    Create new budget
 * @access  Public
 */
const createBudget = asyncHandler(async (req, res) => {
  const { name, amount, category } = req.body;

  // Validation
  if (!name || !amount || !category) {
    throw new ValidationError('Please provide name, amount, and category');
  }

  if (typeof amount !== 'number' || amount <= 0) {
    throw new ValidationError('Amount must be a positive number');
  }

  if (name.length < 3) {
    throw new ValidationError('Budget name must be at least 3 characters');
  }

  // Check for duplicate
  const duplicate = mockDb.budgets.find(b =>
    b.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    throw new ValidationError('Budget with this name already exists');
  }

  const newBudget = {
    id: mockDb.budgets.length + 1,
    name,
    amount,
    category
  };

  mockDb.budgets.push(newBudget);

  res.status(201).json({
    success: true,
    data: newBudget
  });
});

/**
 * @route   PUT /api/budgets/:id
 * @desc    Update budget
 * @access  Public
 */
const updateBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, amount, category } = req.body;

  // Validate ID
  if (isNaN(id)) {
    throw new ValidationError('Budget ID must be a number');
  }

  const budgetIndex = mockDb.budgets.findIndex(b => b.id === parseInt(id));

  if (budgetIndex === -1) {
    throw new NotFoundError(`Budget with ID ${id} not found`);
  }

  // Validate amount if provided
  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    throw new ValidationError('Amount must be a positive number');
  }

  // Update budget
  const updatedBudget = {
    ...mockDb.budgets[budgetIndex],
    ...(name && { name }),
    ...(amount && { amount }),
    ...(category && { category })
  };

  mockDb.budgets[budgetIndex] = updatedBudget;

  res.status(200).json({
    success: true,
    data: updatedBudget
  });
});

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete budget
 * @access  Public
 */
const deleteBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (isNaN(id)) {
    throw new ValidationError('Budget ID must be a number');
  }

  const budgetIndex = mockDb.budgets.findIndex(b => b.id === parseInt(id));

  if (budgetIndex === -1) {
    throw new NotFoundError(`Budget with ID ${id} not found`);
  }

  mockDb.budgets.splice(budgetIndex, 1);

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @route   GET /api/budgets/error/database
 * @desc    Simulate database error
 * @access  Public
 */
const simulateDatabaseError = asyncHandler(async (req, res) => {
  throw new DatabaseError('Failed to connect to database');
});

/**
 * @route   GET /api/budgets/error/server
 * @desc    Simulate unexpected server error
 * @access  Public
 */
const simulateServerError = asyncHandler(async (req, res) => {
  // Simulate unexpected error
  throw new Error('Unexpected server error occurred');
});

module.exports = {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  simulateDatabaseError,
  simulateServerError
};
