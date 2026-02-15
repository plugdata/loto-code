// ===== Restricted Numbers Service (Prisma) =====
import { prisma } from '../db/connection.js';

const formatRow = (r) => ({
  id: r.id,
  number: r.number,
  maxAmount: r.maxAmount,
  payRate: r.payRate ?? null,
  type: r.type,
  lotteryTypeId: r.lotteryTypeId || null,
  lotteryTypeName: r.lotteryType?.name || null,
});

export const restrictedService = {
  async findAll(lotteryTypeId) {
    const where = {};
    if (lotteryTypeId) where.lotteryTypeId = parseInt(lotteryTypeId);

    const rows = await prisma.restrictedNumber.findMany({
      where,
      orderBy: { id: 'asc' },
      include: { lotteryType: { select: { name: true, code: true } } },
    });
    return rows.map(formatRow);
  },

  async create(data) {
    const { number, maxAmount, payRate, type, lotteryTypeId } = data;

    if (!number) {
      const error = new Error('กรุณาใส่เลข');
      error.status = 400;
      throw error;
    }

    await prisma.restrictedNumber.create({
      data: {
        number,
        maxAmount: maxAmount ?? 0,
        payRate: payRate != null ? parseFloat(payRate) : null,
        type: type || '2ตัว',
        lotteryTypeId: lotteryTypeId ? parseInt(lotteryTypeId) : null,
      },
    });

    return this.findAll(lotteryTypeId);
  },

  async removeById(id) {
    const record = await prisma.restrictedNumber.findUnique({ where: { id: parseInt(id) } });
    if (!record) {
      const error = new Error('ไม่พบเลขอั้นนี้');
      error.status = 404;
      throw error;
    }
    await prisma.restrictedNumber.delete({ where: { id: parseInt(id) } });
    return this.findAll(record.lotteryTypeId);
  },

  async removeByNumber(number) {
    await prisma.restrictedNumber.deleteMany({ where: { number } });
    return this.findAll();
  },

  async checkNumber(number, lotteryTypeId, type) {
    const where = { number };
    if (lotteryTypeId) where.lotteryTypeId = parseInt(lotteryTypeId);
    if (type) where.type = type;

    const found = await prisma.restrictedNumber.findFirst({ where });
    if (found) {
      return {
        restricted: true,
        data: { number: found.number, maxAmount: found.maxAmount, payRate: found.payRate, type: found.type, lotteryTypeId: found.lotteryTypeId },
      };
    }
    return { restricted: false, data: null };
  },
};
