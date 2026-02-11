// ===== Bet Types Routes =====
import { Hono } from 'hono';
import { betTypesService } from '../services/betTypes.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const betTypes = new Hono();

betTypes.use('*', authMiddleware);

// GET /api/bet-types
betTypes.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const data = await betTypesService.findAllCategorized();
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

export default betTypes;
