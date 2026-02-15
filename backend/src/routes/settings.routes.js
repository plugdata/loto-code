// ===== Settings Routes =====
import { Hono } from 'hono';
import { settingsService } from '../services/settings.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const settings = new Hono();

settings.use('*', authMiddleware);

// GET /api/settings?lotteryTypeId=1
settings.get('/', requirePerm('settings.read'), async (c) => {
  try {
    const lotteryTypeId = c.req.query('lotteryTypeId') || null;
    const data = await settingsService.getAll(lotteryTypeId);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// PUT /api/settings
settings.put('/', requirePerm('settings.write'), async (c) => {
  try {
    const body = await c.req.json();
    await settingsService.updateAll(body);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

export default settings;
