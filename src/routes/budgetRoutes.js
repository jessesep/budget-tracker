/**
 * Budget routes
 */

const express = require('express');
const router = express.Router();
const {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  simulateDatabaseError,
  simulateServerError
} = require('../controllers/budgetController');

router.get('/', getBudgets);
router.get('/error/database', simulateDatabaseError);
router.get('/error/server', simulateServerError);
router.get('/:id', getBudgetById);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
