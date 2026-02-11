import { prisma } from '../db/connection.js';

export const userCouponsService = {
  async findAll() {
    const userCouponData = await prisma.userCoupon.findMany({
      include: {
        user: { select: { username: true, role: true } },
        coupon: { select: { couponId: true, value: true, expiryDate: true, status: true } },
      },
    });
    if (!userCouponData || userCouponData.length === 0) {
      const error = new Error('User Coupons data not found!');
      error.status = 404;
      throw error;
    }
    return userCouponData;
  },

  async findOne(id) {
    const existingUserCoupon = await prisma.userCoupon.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, role: true } },
        coupon: { select: { couponId: true, value: true, expiryDate: true, status: true } },
      },
    });
    if (!existingUserCoupon) {
      const error = new Error(`User Coupon #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingUserCoupon;
  },

  async create(createUserCouponDto) {
    return prisma.userCoupon.create({
      data: {
        userId: createUserCouponDto.user_id,
        couponId: createUserCouponDto.coupon_id,
        status: createUserCouponDto.status || 'unused',
      },
    });
  },

  async update(id, updateUserCouponDto) {
    const existingUserCoupon = await prisma.userCoupon.findUnique({ where: { id } });
    if (!existingUserCoupon) {
      const error = new Error(`User Coupon #${id} not found`);
      error.status = 404;
      throw error;
    }
    const data = {};
    if (updateUserCouponDto.user_id) data.userId = updateUserCouponDto.user_id;
    if (updateUserCouponDto.coupon_id) data.couponId = updateUserCouponDto.coupon_id;
    if (updateUserCouponDto.status) data.status = updateUserCouponDto.status;

    return prisma.userCoupon.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    const existingUserCoupon = await prisma.userCoupon.findUnique({ where: { id } });
    if (!existingUserCoupon) {
      const error = new Error(`User Coupon #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.userCoupon.delete({ where: { id } });
  },
};
