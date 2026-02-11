import { prisma } from '../db/connection.js';

export const purchaseLimitsService = {
  async findAll() {
    const purchaseLimitData = await prisma.purchaseLimit.findMany({
      include: {
        product: { select: { name: true, stock: true } },
      },
    });
    if (!purchaseLimitData || purchaseLimitData.length === 0) {
      const error = new Error('Purchase Limit data not found!');
      error.status = 404;
      throw error;
    }
    return purchaseLimitData;
  },

  async findOne(id) {
    const existingPurchaseLimit = await prisma.purchaseLimit.findUnique({
      where: { id },
      include: {
        product: { select: { name: true, stock: true } },
      },
    });
    if (!existingPurchaseLimit) {
      const error = new Error(`Purchase Limit #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingPurchaseLimit;
  },

  async create(createPurchaseLimitDto) {
    return prisma.purchaseLimit.create({
      data: {
        productId: createPurchaseLimitDto.product_id,
        maxQuantity: createPurchaseLimitDto.max_quantity,
        budgetLimit: createPurchaseLimitDto.budget_limit,
      },
    });
  },

  async update(id, updatePurchaseLimitDto) {
    const existingPurchaseLimit = await prisma.purchaseLimit.findUnique({ where: { id } });
    if (!existingPurchaseLimit) {
      const error = new Error(`Purchase Limit #${id} not found`);
      error.status = 404;
      throw error;
    }
    const data = {};
    if (updatePurchaseLimitDto.product_id) data.productId = updatePurchaseLimitDto.product_id;
    if (updatePurchaseLimitDto.max_quantity !== undefined) data.maxQuantity = updatePurchaseLimitDto.max_quantity;
    if (updatePurchaseLimitDto.budget_limit !== undefined) data.budgetLimit = updatePurchaseLimitDto.budget_limit;

    return prisma.purchaseLimit.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    const existingPurchaseLimit = await prisma.purchaseLimit.findUnique({ where: { id } });
    if (!existingPurchaseLimit) {
      const error = new Error(`Purchase Limit #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.purchaseLimit.delete({ where: { id } });
  },
};
