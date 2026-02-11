import { Hono } from 'hono';
import { keepIdService } from '../services/keepId.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const keepId = new Hono();

keepId.use('*', authMiddleware);

// GET /keep-id
keepId.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const keepIdData = await keepIdService.findAll();
    return c.json(keepIdData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /keep-id/:id
keepId.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingKeepId = await keepIdService.findOne(id);
    return c.json(existingKeepId, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /keep-id/create
keepId.post('/create', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newKeepId = await keepIdService.create(body);
    return c.json({
      message: 'Keep ID has been created successfully',
      newKeepId,
    }, 201);
  } catch (err) {
    return c.json({
      statusCode: 400,
      message: 'Error: Keep ID not created!',
      error: 'Bad Request',
    }, err.status || 400);
  }
});

// PATCH /keep-id/:id
keepId.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existingKeepId = await keepIdService.update(id, body);
    return c.json({
      message: 'Keep ID has been successfully updated',
      existingKeepId,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

// DELETE /keep-id/:id
keepId.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const deletedKeepId = await keepIdService.remove(id);
    return c.json({
      message: 'Keep ID deleted successfully',
      deletedKeepId,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default keepId;
