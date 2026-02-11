// ===== Restricted Numbers Routes =====
import { Hono } from 'hono';
import { restrictedService } from '../services/restricted.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const restricted = new Hono();

restricted.use('*', authMiddleware);

// GET /api/restricted
restricted.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const data = await restrictedService.findAll();
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

// DELETE /api/restricted/:number
restricted.delete('/:number', requirePerm('numbers.delete'), async (c) => {
  try {
    const number = c.req.param('number');
    const data = await restrictedService.removeByNumber(number);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/restricted/check/:number
restricted.get('/check/:number', requirePerm('numbers.read'), async (c) => {
  try {
    const number = c.req.param('number');
    const result = await restrictedService.checkNumber(number);
    return c.json({ success: true, ...result });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

export default restricted;
