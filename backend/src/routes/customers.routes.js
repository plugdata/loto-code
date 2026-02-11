// ===== Customers Routes (Public - Lotto Frontend) =====
import { Hono } from 'hono';
import { customersService } from '../services/customers.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const customers = new Hono();

customers.use('*', authMiddleware);

// GET /api/customers
customers.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const rows = await customersService.findAll();
    const data = [{ id: 0, name: '-- ลูกค้าทั่วไป --' }, ...rows];
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 500);
  }
});

// GET /api/customers/:id
customers.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const data = await customersService.findOne(id);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 404);
  }
});

// POST /api/customers
customers.post('/', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    if (!body.name) {
      return c.json({ success: false, message: 'กรุณากรอกชื่อ' }, 400);
    }
    const data = await customersService.create({
      name: body.name,
      phone: body.phone || '',
    });
    return c.json({ success: true, data }, 201);
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

// PATCH /api/customers/:id
customers.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = await customersService.update(id, body);
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

// DELETE /api/customers/:id
customers.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    await customersService.remove(id);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, message: err.message }, err.status || 400);
  }
});

export default customers;
