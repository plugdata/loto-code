// ===== CRUD Service Factory =====
import { prisma } from '../db/connection.js';

export const createCrudService = (modelName) => ({
  async findAll(options = {}) {
    return prisma[modelName].findMany(options);
  },

  async findOne(id) {
    const record = await prisma[modelName].findUnique({ where: { id } });
    if (!record) {
      const error = new Error(`${modelName} #${id} not found`);
      error.status = 404;
      throw error;
    }
    return record;
  },

  async create(data) {
    return prisma[modelName].create({ data });
  },

  async update(id, data) {
    const existing = await prisma[modelName].findUnique({ where: { id } });
    if (!existing) {
      const error = new Error(`${modelName} #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma[modelName].update({ where: { id }, data });
  },

  async remove(id) {
    const existing = await prisma[modelName].findUnique({ where: { id } });
    if (!existing) {
      const error = new Error(`${modelName} #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma[modelName].delete({ where: { id } });
  },
});
