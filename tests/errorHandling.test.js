/**
 * Error handling tests
 */

const request = require('supertest');
const app = require('../src/app');

describe('API Error Handling Tests', () => {
  describe('GET /api/budgets', () => {
    it('should return all budgets successfully', async () => {
      const res = await request(app).get('/api/budgets');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/budgets/:id', () => {
    it('should return budget by valid ID', async () => {
      const res = await request(app).get('/api/budgets/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent budget', async () => {
      const res = await request(app).get('/api/budgets/999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.message).toContain('not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/budgets/invalid');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.message).toContain('must be a number');
    });
  });

  describe('POST /api/budgets', () => {
    it('should create budget with valid data', async () => {
      const newBudget = {
        name: 'Entertainment',
        amount: 200,
        category: 'leisure'
      };

      const res = await request(app)
        .post('/api/budgets')
        .send(newBudget);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.name).toBe(newBudget.name);
    });

    it('should return 400 when missing required fields', async () => {
      const invalidBudget = {
        name: 'Test Budget'
        // missing amount and category
      };

      const res = await request(app)
        .post('/api/budgets')
        .send(invalidBudget);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('provide name, amount, and category');
    });

    it('should return 400 for invalid amount', async () => {
      const invalidBudget = {
        name: 'Test Budget',
        amount: -100,
        category: 'test'
      };

      const res = await request(app)
        .post('/api/budgets')
        .send(invalidBudget);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('positive number');
    });

    it('should return 400 for non-numeric amount', async () => {
      const invalidBudget = {
        name: 'Test Budget',
        amount: 'not-a-number',
        category: 'test'
      };

      const res = await request(app)
        .post('/api/budgets')
        .send(invalidBudget);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for short budget name', async () => {
      const invalidBudget = {
        name: 'AB',
        amount: 100,
        category: 'test'
      };

      const res = await request(app)
        .post('/api/budgets')
        .send(invalidBudget);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('at least 3 characters');
    });

    it('should return 400 for duplicate budget name', async () => {
      const duplicateBudget = {
        name: 'Monthly Budget', // Already exists in mock data
        amount: 100,
        category: 'test'
      };

      const res = await request(app)
        .post('/api/budgets')
        .send(duplicateBudget);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('already exists');
    });

    it('should return 400 for malformed JSON', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/budgets/:id', () => {
    it('should update budget with valid data', async () => {
      const updateData = {
        amount: 600
      };

      const res = await request(app)
        .put('/api/budgets/1')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(600);
    });

    it('should return 404 for non-existent budget', async () => {
      const res = await request(app)
        .put('/api/budgets/999')
        .send({ amount: 100 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid amount', async () => {
      const res = await request(app)
        .put('/api/budgets/1')
        .send({ amount: -100 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/budgets/:id', () => {
    it('should delete existing budget', async () => {
      const res = await request(app).delete('/api/budgets/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existent budget', async () => {
      const res = await request(app).delete('/api/budgets/999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).delete('/api/budgets/invalid');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for undefined routes', async () => {
      const res = await request(app).get('/api/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('not found');
    });

    it('should return 404 for undefined POST routes', async () => {
      const res = await request(app).post('/api/undefined');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Server Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const res = await request(app).get('/api/budgets/error/database');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('database');
    });

    it('should handle unexpected server errors', async () => {
      const res = await request(app).get('/api/budgets/error/server');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Server is running');
    });
  });
});
