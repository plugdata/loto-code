import { Hono } from 'hono';
import { userCouponsService } from '../services/userCoupons.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const userCoupons = new Hono();

userCoupons.use('*', authMiddleware);

// GET /user-coupons
userCoupons.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const userCouponData = await userCouponsService.findAll();
    return c.json(userCouponData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /user-coupons/:id
userCoupons.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingUserCoupon = await userCouponsService.findOne(id);
    return c.json(existingUserCoupon, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /user-coupons/create
userCoupons.post('/create', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newUserCoupon = await userCouponsService.create(body);
    return c.json({
      message: 'User Coupon has been created successfully',
      newUserCoupon,
    }, 201);
  } catch (err) {
    return c.json({
      statusCode: 400,
      message: 'Error: User Coupon not created!',
      error: 'Bad Request',
    }, err.status || 400);
  }
});

// PATCH /user-coupons/:id
userCoupons.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existingUserCoupon = await userCouponsService.update(id, body);
    return c.json({
      message: 'User Coupon has been successfully updated',
      existingUserCoupon,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

// DELETE /user-coupons/:id
userCoupons.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const deletedUserCoupon = await userCouponsService.remove(id);
    return c.json({
      message: 'User Coupon deleted successfully',
      deletedUserCoupon,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default userCoupons;
