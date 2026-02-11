// ===== Lottery Rounds Service =====
import { prisma } from '../db/connection.js';

// คำนวณ roundNumber ถัดไปสำหรับ lotteryType นั้นๆ
async function getNextRoundNumber(lotteryTypeId) {
  const last = await prisma.lotteryRound.findFirst({
    where: { lotteryTypeId },
    orderBy: { roundNumber: 'desc' },
    select: { roundNumber: true },
  });
  return { next: (last?.roundNumber || 0) + 1, hasRounds: !!last };
}

export const roundsService = {
  // ดึงงวดทั้งหมด (ล่าสุดก่อน) + filter ตาม lotteryTypeId
  async findAll(query = {}) {
    const where = {};
    if (query.lotteryTypeId) {
      where.lotteryTypeId = parseInt(query.lotteryTypeId);
    }
    if (query.status) {
      where.status = query.status;
    }

    return prisma.lotteryRound.findMany({
      where,
      include: {
        lotteryType: { select: { id: true, name: true, code: true, icon: true, isOpen: true, openTime: true, closeTime: true } },
        _count: { select: { transactions: true } },
      },
      orderBy: { roundDate: 'desc' },
    });
  },

  // ดึงงวดปัจจุบัน (status=open) ทั้งหมด
  async findOpen() {
    return prisma.lotteryRound.findMany({
      where: { status: 'open' },
      include: {
        lotteryType: { select: { id: true, name: true, code: true, icon: true, isOpen: true, openTime: true, closeTime: true } },
        _count: { select: { transactions: true } },
      },
      orderBy: { roundDate: 'desc' },
    });
  },

  // ดึงงวดตาม id
  async findById(id) {
    const round = await prisma.lotteryRound.findUnique({
      where: { id },
      include: {
        lotteryType: { select: { id: true, name: true, code: true, icon: true, isOpen: true, openTime: true, closeTime: true } },
        _count: { select: { transactions: true } },
      },
    });
    if (!round) {
      const error = new Error(`Round #${id} not found`);
      error.status = 404;
      throw error;
    }
    return round;
  },

  // ดึงเลขงวดถัดไปสำหรับ lotteryType
  async getNextRoundNumber(lotteryTypeId) {
    const ltId = parseInt(lotteryTypeId);
    const lt = await prisma.lotteryType.findUnique({ where: { id: ltId } });
    if (!lt) {
      const error = new Error('ไม่พบประเภทหวยนี้');
      error.status = 400;
      throw error;
    }
    return getNextRoundNumber(ltId);
  },

  // สร้างงวดใหม่
  async create(data) {
    const { roundDate, lotteryTypeId, note, roundNumber: customRoundNumber } = data;
    const ltId = parseInt(lotteryTypeId);

    // ตรวจสอบว่า lotteryType มีอยู่จริง
    const lt = await prisma.lotteryType.findUnique({ where: { id: ltId } });
    if (!lt) {
      const error = new Error('ไม่พบประเภทหวยนี้');
      error.status = 400;
      throw error;
    }

    // ตรวจสอบซ้ำ (วันเดียวกัน + ประเภทเดียวกัน)
    const existing = await prisma.lotteryRound.findUnique({
      where: {
        roundDate_lotteryTypeId: {
          roundDate: new Date(roundDate),
          lotteryTypeId: ltId,
        },
      },
    });
    if (existing) {
      const error = new Error('งวดนี้มีอยู่แล้วสำหรับประเภทหวยนี้');
      error.status = 400;
      throw error;
    }

    // ใช้ roundNumber ที่กำหนดเอง (ครั้งแรก) หรือ auto-increment
    const { next } = await getNextRoundNumber(ltId);
    const roundNumber = customRoundNumber ? parseInt(customRoundNumber) : next;

    return prisma.lotteryRound.create({
      data: {
        roundNumber,
        roundDate: new Date(roundDate),
        lotteryTypeId: ltId,
        note: note || null,
        status: 'open',
      },
      include: {
        lotteryType: { select: { id: true, name: true, code: true, icon: true, isOpen: true } },
      },
    });
  },

  // สร้างงวดสำหรับ ทุกประเภทหวย พร้อมกัน
  async createBulk(data) {
    const { roundDate, lotteryTypeIds, note } = data;
    const results = [];

    for (const ltId of lotteryTypeIds) {
      const id = parseInt(ltId);
      const existing = await prisma.lotteryRound.findUnique({
        where: {
          roundDate_lotteryTypeId: {
            roundDate: new Date(roundDate),
            lotteryTypeId: id,
          },
        },
      });
      if (existing) continue;

      const { next: roundNumber } = await getNextRoundNumber(id);

      const round = await prisma.lotteryRound.create({
        data: {
          roundNumber,
          roundDate: new Date(roundDate),
          lotteryTypeId: id,
          note: note || null,
          status: 'open',
        },
        include: {
          lotteryType: { select: { id: true, name: true, code: true, icon: true, isOpen: true } },
        },
      });
      results.push(round);
    }

    return results;
  },

  // อัปเดตงวด (เปลี่ยน status, note)
  async update(id, data) {
    const existing = await prisma.lotteryRound.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error(`Round #${id} not found`);
      error.status = 404;
      throw error;
    }

    const updateData = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.note !== undefined) updateData.note = data.note;
    if (data.roundDate !== undefined) updateData.roundDate = new Date(data.roundDate);

    return prisma.lotteryRound.update({
      where: { id },
      data: updateData,
      include: {
        lotteryType: { select: { id: true, name: true, code: true, icon: true, isOpen: true } },
      },
    });
  },

  // ลบงวด
  async remove(id) {
    const existing = await prisma.lotteryRound.findUnique({
      where: { id },
      include: { _count: { select: { transactions: true } } },
    });
    if (!existing) {
      const error = new Error(`Round #${id} not found`);
      error.status = 404;
      throw error;
    }
    if (existing._count.transactions > 0) {
      const error = new Error('ไม่สามารถลบงวดที่มีรายการแทงอยู่');
      error.status = 400;
      throw error;
    }

    return prisma.lotteryRound.delete({ where: { id } });
  },

  // ดึงงวดพร้อม transactions สำหรับ report
  async getReport(id) {
    const round = await prisma.lotteryRound.findUnique({
      where: { id },
      include: {
        lotteryType: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!round) {
      const error = new Error(`Round #${id} not found`);
      error.status = 404;
      throw error;
    }

    const totalAmount = round.transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalBills = round.transactions.length;

    return {
      ...round,
      summary: { totalAmount, totalBills },
    };
  },
};
