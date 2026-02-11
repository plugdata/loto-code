// ===== Lottery Types Routes =====
import { Hono } from 'hono';
import { lotteryTypesService } from '../services/lotteryTypes.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const lotteryTypes = new Hono();

lotteryTypes.use('*', authMiddleware);

// GET /api/lottery-types — list all sorted
lotteryTypes.get('/', async (c) => {
  try {
    const data = await lotteryTypesService.findAllSorted();
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/lottery-types/check/:code — check if lottery type is open
lotteryTypes.get('/check/:code', async (c) => {
  try {
    const code = c.req.param('code');
    const result = await lotteryTypesService.checkByCode(code);
    return c.json({ success: true, data: result });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// POST /api/lottery-types — create
lotteryTypes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = await lotteryTypesService.create(body);
    return c.json({ success: true, data }, 201);
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// PATCH /api/lottery-types/:id — update
lotteryTypes.patch('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const data = await lotteryTypesService.update(id, body);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// DELETE /api/lottery-types/:id — delete
lotteryTypes.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await lotteryTypesService.remove(id);
    return c.json({ success: true, message: 'Deleted' });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

export default lotteryTypes;
