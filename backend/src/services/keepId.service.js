import { prisma } from '../db/connection.js';

export const keepIdService = {
  async findAll() {
    const keepIdData = await prisma.keepId.findMany({
      include: {
        user: { select: { username: true, role: true } },
        customer: true,
      },
    });
    if (!keepIdData || keepIdData.length === 0) {
      const error = new Error('Keep ID data not found!');
      error.status = 404;
      throw error;
    }
    return keepIdData;
  },

  async findOne(id) {
    const existingKeepId = await prisma.keepId.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, role: true } },
        customer: true,
      },
    });
    if (!existingKeepId) {
      const error = new Error(`Keep ID #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingKeepId;
  },

  async create(createKeepIdDto) {
    return prisma.keepId.create({
      data: {
        userId: createKeepIdDto.user_id,
        customerId: createKeepIdDto.customer_id,
      },
    });
  },

  async update(id, updateKeepIdDto) {
    const existingKeepId = await prisma.keepId.findUnique({ where: { id } });
    if (!existingKeepId) {
      const error = new Error(`Keep ID #${id} not found`);
      error.status = 404;
      throw error;
    }
    const data = {};
    if (updateKeepIdDto.user_id) data.userId = updateKeepIdDto.user_id;
    if (updateKeepIdDto.customer_id) data.customerId = updateKeepIdDto.customer_id;

    return prisma.keepId.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    const existingKeepId = await prisma.keepId.findUnique({ where: { id } });
    if (!existingKeepId) {
      const error = new Error(`Keep ID #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.keepId.delete({ where: { id } });
  },
};
