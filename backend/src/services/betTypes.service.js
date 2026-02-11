// ===== Bet Types Service (Prisma) =====
import { prisma } from '../db/connection.js';

export const betTypesService = {
  async findAllCategorized() {
    const rows = await prisma.betType.findMany({ orderBy: { sortOrder: 'asc' } });

    return {
      digit2: rows.filter((r) => r.category === '2digit'),
      digit3: rows.filter((r) => r.category === '3digit'),
      special: rows.filter((r) => r.category === 'special'),
    };
  },
};
