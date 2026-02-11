// ===== Transactions Routes =====
import { Hono } from 'hono';
import { transactionsService } from '../services/transactions.service.js';

import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const transactions = new Hono();

// Apply auth middleware to all transaction routes
transactions.use('*', authMiddleware);

// GET /api/transactions
transactions.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const data = await transactionsService.findAll();
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// POST /api/transactions
transactions.post('/', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const data = await transactionsService.create(body);
    return c.json({ success: true, data }, 201);
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

// DELETE /api/transactions/:id
transactions.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await transactionsService.remove(id);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 404);
  }
});

// DELETE /api/transactions (clear all)
transactions.delete('/', requirePerm('numbers.delete'), async (c) => {
  try {
    await transactionsService.removeAll();
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

export default transactions;
