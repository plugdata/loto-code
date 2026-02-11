import { Hono } from 'hono';
import { couponsService } from '../services/coupons.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const coupons = new Hono();

coupons.use('*', authMiddleware);

// GET /coupons
coupons.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const couponsData = await couponsService.findAll();
    return c.json(couponsData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /coupons/:id
coupons.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingCoupon = await couponsService.findOne(id);
    return c.json(existingCoupon, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /coupons/create
coupons.post('/create', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newCoupon = await couponsService.create(body);
    return c.json({
      message: 'Coupon has been created successfully',
      newCoupon,
    }, 201);
  } catch (err) {
    if (err.status === 409) {
      return c.json({ message: err.message }, 409);
    }
    return c.json({
      statusCode: 400,
      message: 'Error: Coupon not created!',
      error: 'Bad Request',
    }, err.status || 400);
  }
});

// PATCH /coupons/:id
coupons.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existingCoupon = await couponsService.update(id, body);
    return c.json({
      message: 'Coupon has been successfully updated',
      existingCoupon,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

// DELETE /coupons/:id
coupons.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const deletedCoupon = await couponsService.remove(id);
    return c.json({
      message: 'Coupon deleted successfully',
      deletedCoupon,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default coupons;
