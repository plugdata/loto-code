// ===== Summary Service (Prisma + Calculator) =====
import { prisma } from '../db/connection.js';
import { sumTotal } from '../utils/calculator.js';

export const summaryService = {
  async getSummary() {
    const transactions = await prisma.transaction.findMany();

    const totalBills = transactions.length;
    const totalAmount = sumTotal(transactions, 'amount');

    const uniqueCustomers = new Set(transactions.map((t) => t.customerName));
    const totalCustomers = uniqueCustomers.size;

    const numberTotals = {};
    for (const tx of transactions) {
      numberTotals[tx.number] = (numberTotals[tx.number] || 0) + tx.amount;
    }

    const topNumbers = Object.entries(numberTotals)
      .map(([number, total]) => ({ number, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return { totalBills, totalAmount, totalCustomers, topNumbers };
  },
};
