import { Hono } from 'hono';
import { purchaseLimitsService } from '../services/purchaseLimits.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const purchaseLimits = new Hono();

purchaseLimits.use('*', authMiddleware);

// GET /purchase-limits
purchaseLimits.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const purchaseLimitData = await purchaseLimitsService.findAll();
    return c.json(purchaseLimitData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /purchase-limits/:id
purchaseLimits.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingPurchaseLimit = await purchaseLimitsService.findOne(id);
    return c.json(existingPurchaseLimit, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /purchase-limits/create
purchaseLimits.post('/create', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newPurchaseLimit = await purchaseLimitsService.create(body);
    return c.json({
      message: 'Purchase Limit has been created successfully',
      newPurchaseLimit,
    }, 201);
  } catch (err) {
    return c.json({
      statusCode: 400,
      message: 'Error: Purchase Limit not created!',
      error: 'Bad Request',
    }, err.status || 400);
  }
});

// PATCH /purchase-limits/:id
purchaseLimits.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existingPurchaseLimit = await purchaseLimitsService.update(id, body);
    return c.json({
      message: 'Purchase Limit has been successfully updated',
      existingPurchaseLimit,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

// DELETE /purchase-limits/:id
purchaseLimits.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const deletedPurchaseLimit = await purchaseLimitsService.remove(id);
    return c.json({
      message: 'Purchase Limit deleted successfully',
      deletedPurchaseLimit,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default purchaseLimits;
