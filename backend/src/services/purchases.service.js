import { prisma } from '../db/connection.js';

export const purchasesService = {
  async findAll() {
    const purchaseData = await prisma.purchase.findMany({
      include: {
        user: { select: { username: true, role: true } },
        coupon: { select: { couponId: true, value: true, expiryDate: true, status: true } },
        purchaseItems: { select: { productId: true, quantity: true, price: true } },
      },
    });

    if (!purchaseData || purchaseData.length === 0) {
      const error = new Error('Purchase data not found!');
      error.status = 404;
      throw error;
    }
    return purchaseData;
  },

  async findOne(id) {
    const existingPurchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, role: true } },
        coupon: { select: { couponId: true, value: true, expiryDate: true, status: true } },
        purchaseItems: { select: { productId: true, quantity: true, price: true } },
      },
    });

    if (!existingPurchase) {
      const error = new Error(`Purchase #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingPurchase;
  },

  async createPurchases(createPurchaseDto) {
    return prisma.$transaction(async (tx) => {
      if (createPurchaseDto.coupon_id) {
        const existingCoupon = await tx.coupon.findUnique({
          where: { id: createPurchaseDto.coupon_id },
        });
        if (!existingCoupon) {
          const error = new Error('Coupon not found');
          error.status = 404;
          throw error;
        } else if (existingCoupon.status === 'used') {
          const error = new Error('Coupon already used');
          error.status = 400;
          throw error;
        } else if (new Date(existingCoupon.expiryDate) < new Date()) {
          const error = new Error('Coupon expired');
          error.status = 400;
          throw error;
        }
      }

      for (const product of createPurchaseDto.products) {
        const purchaseLimit = await tx.purchaseLimit.findFirst({
          where: { productId: product.product_id },
        });
        if (!purchaseLimit) {
          const error = new Error(`Product #${product.product_id} is Purchase limit not found`);
          error.status = 404;
          throw error;
        }
        if (purchaseLimit.maxQuantity < product.quantity) {
          const error = new Error(`Product #${product.product_id} is Purchase limit exceeded`);
          error.status = 400;
          throw error;
        }

        const existingProduct = await tx.product.findUnique({
          where: { id: product.product_id },
        });
        if (!existingProduct) {
          const error = new Error(`Product #${product.product_id} not found`);
          error.status = 404;
          throw error;
        }
        if (existingProduct.stock < product.quantity) {
          const error = new Error(`Product #${product.product_id} is out of stock`);
          error.status = 400;
          throw error;
        }
      }

      const createdPurchase = await tx.purchase.create({
        data: {
          userId: createPurchaseDto.user_id,
          totalAmount: createPurchaseDto.total_amount,
          percentageDiscount: createPurchaseDto.percentage_discount,
          couponId: createPurchaseDto.coupon_id || null,
        },
      });

      for (const product of createPurchaseDto.products) {
        await tx.purchaseItem.create({
          data: {
            purchaseId: createdPurchase.id,
            productId: product.product_id,
            quantity: product.quantity,
            price: product.price,
          },
        });
        await tx.product.update({
          where: { id: product.product_id },
          data: { stock: { decrement: product.quantity } },
        });
      }

      if (createPurchaseDto.coupon_id) {
        await tx.coupon.update({
          where: { id: createPurchaseDto.coupon_id },
          data: { status: 'used' },
        });
      }

      await tx.percentAllocation.create({
        data: {
          userId: createPurchaseDto.user_id,
          percentage: createPurchaseDto.percentage,
          thresholdAmount:
            (createPurchaseDto.total_amount * createPurchaseDto.percentage) / 100,
        },
      });

      return createdPurchase;
    });
  },
};
