import { prisma } from '../db/connection.js';

export const productsService = {
  async findAll() {
    const productData = await prisma.product.findMany();
    if (!productData || productData.length === 0) {
      const error = new Error('Product data not found!');
      error.status = 404;
      throw error;
    }
    return productData;
  },

  async findOne(id) {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      const error = new Error(`Product #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingProduct;
  },

  async create(createProductDto) {
    return prisma.product.create({ data: createProductDto });
  },

  async update(id, updateProductDto) {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      const error = new Error(`Product #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  },

  async remove(id) {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      const error = new Error(`Product #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.product.delete({ where: { id } });
  },
};
