// ===== Lottery Rounds Routes =====
import { Hono } from 'hono';
import { roundsService } from '../services/rounds.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const rounds = new Hono();

rounds.use('*', authMiddleware);

// GET /api/rounds — list all rounds (optional ?lotteryTypeId=1&status=open)
rounds.get('/', async (c) => {
  try {
    const query = c.req.query();
    const data = await roundsService.findAll(query);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/rounds/next-number/:lotteryTypeId — get next round number for a lottery type
rounds.get('/next-number/:lotteryTypeId', async (c) => {
  try {
    const lotteryTypeId = parseInt(c.req.param('lotteryTypeId'));
    const data = await roundsService.getNextRoundNumber(lotteryTypeId);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/rounds/open — get current open rounds
rounds.get('/open', async (c) => {
  try {
    const data = await roundsService.findOpen();
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/rounds/:id — get single round
rounds.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await roundsService.findById(id);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/rounds/:id/report — get round with transactions for report
rounds.get('/:id/report', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await roundsService.getReport(id);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// POST /api/rounds — create round
rounds.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = await roundsService.create(body);
    return c.json({ success: true, data }, 201);
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

// POST /api/rounds/bulk — create rounds for multiple lottery types
rounds.post('/bulk', async (c) => {
  try {
    const body = await c.req.json();
    const data = await roundsService.createBulk(body);
    return c.json({ success: true, data }, 201);
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

// PATCH /api/rounds/:id — update round (status, note)
rounds.patch('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const data = await roundsService.update(id, body);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// DELETE /api/rounds/:id — delete round
rounds.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await roundsService.remove(id);
    return c.json({ success: true, message: 'Deleted' });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

export default rounds;
