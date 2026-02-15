// ===== Lottery Types Service =====
import { createCrudService } from '../utils/serviceFactory.js';
import { prisma } from '../db/connection.js';

const baseCrud = createCrudService('lotteryType');

export const lotteryTypesService = {
  ...baseCrud,

  // Override update to log openTime/closeTime changes
  async update(id, data, user) {
    const existing = await prisma.lotteryType.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error(`lotteryType #${id} not found`);
      error.status = 404;
      throw error;
    }

    const updated = await prisma.lotteryType.update({ where: { id }, data });

    // Log time changes
    const changedByName = user?.displayName || user?.username || 'ADMIN';
    const logs = [];
    if (data.openTime && data.openTime !== existing.openTime) {
      logs.push({ lotteryTypeId: id, field: 'openTime', oldValue: existing.openTime, newValue: data.openTime, changedByName });
    }
    if (data.closeTime && data.closeTime !== existing.closeTime) {
      logs.push({ lotteryTypeId: id, field: 'closeTime', oldValue: existing.closeTime, newValue: data.closeTime, changedByName });
    }
    if (logs.length > 0) {
      await prisma.lotteryTypeLog.createMany({ data: logs });
    }

    return updated;
  },

  async getLogs(lotteryTypeId) {
    return prisma.lotteryTypeLog.findMany({
      where: { lotteryTypeId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

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
