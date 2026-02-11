import { prisma } from '../db/connection.js';

export const couponsService = {
  async findAll() {
    const couponData = await prisma.coupon.findMany();
    if (!couponData || couponData.length === 0) {
      const error = new Error('Coupon data not found!');
      error.status = 404;
      throw error;
    }
    return couponData;
  },

  async findOne(id) {
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) {
      const error = new Error(`Coupon #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingCoupon;
  },

  async create(createCouponDto) {
    try {
      return await prisma.coupon.create({
        data: {
          couponId: createCouponDto.coupon_id,
          value: createCouponDto.value,
          expiryDate: new Date(createCouponDto.expiry_date),
          status: createCouponDto.status || 'unused',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const conflictError = new Error('Coupon ID already exists');
        conflictError.status = 409;
        throw conflictError;
      }
      throw error;
    }
  },

  async update(id, updateCouponDto) {
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) {
      const error = new Error(`Coupon #${id} not found`);
      error.status = 404;
      throw error;
    }
    const data = {};
    if (updateCouponDto.coupon_id) data.couponId = updateCouponDto.coupon_id;
    if (updateCouponDto.value !== undefined) data.value = updateCouponDto.value;
    if (updateCouponDto.expiry_date) data.expiryDate = new Date(updateCouponDto.expiry_date);
    if (updateCouponDto.status) data.status = updateCouponDto.status;

    return prisma.coupon.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) {
      const error = new Error(`Coupon #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.coupon.delete({ where: { id } });
  },
};
