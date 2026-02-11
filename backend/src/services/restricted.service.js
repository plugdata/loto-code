// ===== Restricted Numbers Service (Prisma) =====
import { prisma } from '../db/connection.js';

const formatRow = (r) => ({
  id: r.id,
  number: r.number,
  maxAmount: r.maxAmount,
  type: r.type,
});

export const restrictedService = {
  async findAll() {
    const rows = await prisma.restrictedNumber.findMany({ orderBy: { id: 'asc' } });
    return rows.map(formatRow);
  },

  async create(data) {
    const { number, maxAmount, type } = data;

    if (!number) {
      const error = new Error('กรุณาใส่เลข');
      error.status = 400;
      throw error;
    }

    await prisma.restrictedNumber.create({
      data: {
        number,
        maxAmount: maxAmount ?? 0,
        type: type || '2ตัว',
      },
    });

    return this.findAll();
  },

  async removeByNumber(number) {
    await prisma.restrictedNumber.deleteMany({ where: { number } });
    return this.findAll();
  },

  async checkNumber(number) {
    const found = await prisma.restrictedNumber.findFirst({ where: { number } });
    if (found) {
      return {
        restricted: true,
        data: { number: found.number, maxAmount: found.maxAmount, type: found.type },
      };
    }
    return { restricted: false, data: null };
  },
};
