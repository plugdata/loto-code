// ===== Restricted Numbers Routes =====
import { Hono } from 'hono';
import { restrictedService } from '../services/restricted.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const restricted = new Hono();

restricted.use('*', authMiddleware);

// GET /api/restricted?lotteryTypeId=X
restricted.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const lotteryTypeId = c.req.query('lotteryTypeId');
    const data = await restrictedService.findAll(lotteryTypeId);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// POST /api/restricted
restricted.post('/', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const data = await restrictedService.create(body);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

// DELETE /api/restricted/id/:id — delete by ID
restricted.delete('/id/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await restrictedService.removeById(id);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// DELETE /api/restricted/:number — delete by number (legacy)
restricted.delete('/:number', requirePerm('numbers.delete'), async (c) => {
  try {
    const number = c.req.param('number');
    const data = await restrictedService.removeByNumber(number);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/restricted/check/:number?lotteryTypeId=X
restricted.get('/check/:number', requirePerm('numbers.read'), async (c) => {
  try {
    const number = c.req.param('number');
    const lotteryTypeId = c.req.query('lotteryTypeId');
    const type = c.req.query('type');
    const result = await restrictedService.checkNumber(number, lotteryTypeId, type);
    return c.json({ success: true, ...result });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

export default restricted;
