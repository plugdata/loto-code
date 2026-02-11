import { Hono } from 'hono';
import { purchasesService } from '../services/purchases.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const purchases = new Hono();

purchases.use('*', authMiddleware);

// GET /purchases
purchases.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const purchaseData = await purchasesService.findAll();
    return c.json(purchaseData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /purchases/:id
purchases.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingPurchase = await purchasesService.findOne(id);
    return c.json(existingPurchase, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /purchases
purchases.post('/', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newPurchase = await purchasesService.createPurchases({
      ...body,
      user_id: '60f1e7b6b438f0001f000001',
    });
    return c.json({
      message: 'Purchase has been created successfully',
      newPurchase,
    }, 201);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default purchases;
