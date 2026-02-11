import { prisma } from '../db/connection.js';

export const percentAllocationsService = {
  async findAll() {
    const percentAllocationData = await prisma.percentAllocation.findMany({
      include: {
        user: { select: { username: true, role: true } },
      },
    });
    if (!percentAllocationData || percentAllocationData.length === 0) {
      const error = new Error('Percent Allocation data not found!');
      error.status = 404;
      throw error;
    }
    return percentAllocationData;
  },

  async findOne(id) {
    const existingPercentAllocation = await prisma.percentAllocation.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, role: true } },
      },
    });
    if (!existingPercentAllocation) {
      const error = new Error(`Percent Allocation #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingPercentAllocation;
  },

  async create(createPercentAllocationDto) {
    return prisma.percentAllocation.create({
      data: {
        userId: createPercentAllocationDto.user_id,
        percentage: createPercentAllocationDto.percentage,
        thresholdAmount: createPercentAllocationDto.threshold_amount,
      },
    });
  },

  async update(id, updatePercentAllocationDto) {
    const existingPercentAllocation = await prisma.percentAllocation.findUnique({ where: { id } });
    if (!existingPercentAllocation) {
      const error = new Error(`Percent Allocation #${id} not found`);
      error.status = 404;
      throw error;
    }
    const data = {};
    if (updatePercentAllocationDto.user_id) data.userId = updatePercentAllocationDto.user_id;
    if (updatePercentAllocationDto.percentage !== undefined) data.percentage = updatePercentAllocationDto.percentage;
    if (updatePercentAllocationDto.threshold_amount !== undefined) data.thresholdAmount = updatePercentAllocationDto.threshold_amount;

    return prisma.percentAllocation.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    const existingPercentAllocation = await prisma.percentAllocation.findUnique({ where: { id } });
    if (!existingPercentAllocation) {
      const error = new Error(`Percent Allocation #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.percentAllocation.delete({ where: { id } });
  },
};
