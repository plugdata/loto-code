// ===== Transactions Service (Prisma + Factory) =====
import { prisma } from '../db/connection.js';
import { createCrudService } from '../utils/serviceFactory.js';

const crud = createCrudService('transaction');

export const transactionsService = {
  ...crud,

  async findAll() {
    return prisma.transaction.findMany({ orderBy: { id: 'desc' } });
  },

  async create(data) {
    const { bet_type_code, bet_type_label, number, amount, customer_id, customer_name, user_id, user_name } = data;

    if (!number || !amount) {
      const error = new Error('กรุณาใส่เลขและจำนวนเงิน');
      error.status = 400;
      throw error;
    }

    return prisma.transaction.create({
      data: {
        betTypeCode: bet_type_code || '',
        betTypeLabel: bet_type_label || '',
        number,
        amount,
        customerId: customer_id || null,
        customerName: customer_name || 'ลูกค้าทั่วไป',
        userId: user_id || null,
        userName: user_name || 'ADMIN',
      },
    });
  },

  async removeAll() {
    return prisma.transaction.deleteMany({});
  },
};
