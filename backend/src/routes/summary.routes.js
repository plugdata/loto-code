// ===== Summary Routes =====
import { Hono } from 'hono';
import { summaryService } from '../services/summary.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const summary = new Hono();

summary.use('*', authMiddleware);

// GET /api/summary
summary.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const data = await summaryService.getSummary();
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

export default summary;
