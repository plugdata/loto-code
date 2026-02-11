// ===== Users Routes =====
import { Hono } from 'hono';
import { usersService } from '../services/users.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const users = new Hono();

users.use('*', authMiddleware);

// GET /api/users
users.get('/', requirePerm('users.read'), async (c) => {
  try {
    const data = await usersService.findAll();
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/users/:id
users.get('/:id', requirePerm('users.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const data = await usersService.findOne(id);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 404);
  }
});

// PATCH /api/users/:id
users.patch('/:id', requirePerm('users.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = await usersService.update(id, body);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

// DELETE /api/users/:id
users.delete('/:id', requirePerm('users.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    await usersService.remove(id);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

export default users;
