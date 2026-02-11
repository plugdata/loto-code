// ===== Lottery Types Service =====
import { createCrudService } from '../utils/serviceFactory.js';
import { prisma } from '../db/connection.js';

const baseCrud = createCrudService('lotteryType');

export const lotteryTypesService = {
  ...baseCrud,

  async findAllSorted() {
    return prisma.lotteryType.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  },

  async checkByCode(code) {
    const lt = await prisma.lotteryType.findUnique({ where: { code } });
    if (!lt) {
      return { exists: false, isOpen: false, closeTime: null, name: null };
    }

    // isOpen = admin toggle (เปิด/ปิดตลอด ไม่เช็คเวลา)
    return {
      exists: true,
      isOpen: lt.isOpen,
      closeTime: lt.closeTime,
      openTime: lt.openTime,
      name: lt.name,
      icon: lt.icon,
    };
  },
};
