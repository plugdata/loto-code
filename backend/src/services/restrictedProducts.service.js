import { prisma } from '../db/connection.js';

export const restrictedProductsService = {
  async findAll() {
    const restrictedProductData = await prisma.restrictedProduct.findMany({
      include: {
        customer: true,
      },
    });
    if (!restrictedProductData || restrictedProductData.length === 0) {
      const error = new Error('Restricted Product data not found!');
      error.status = 404;
      throw error;
    }
    return restrictedProductData;
  },

  async findOne(id) {
    const existingRestrictedProduct = await prisma.restrictedProduct.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });
    if (!existingRestrictedProduct) {
      const error = new Error(`Restricted Product #${id} not found`);
      error.status = 404;
      throw error;
    }
    return existingRestrictedProduct;
  },

  async create(createRestrictedProductDto) {
    return prisma.restrictedProduct.create({
      data: {
        customerId: createRestrictedProductDto.customer_id,
        productName: createRestrictedProductDto.product_name,
        productCode: createRestrictedProductDto.product_code,
      },
    });
  },

  async update(id, updateRestrictedProductDto) {
    const existingRestrictedProduct = await prisma.restrictedProduct.findUnique({ where: { id } });
    if (!existingRestrictedProduct) {
      const error = new Error(`Restricted Product #${id} not found`);
      error.status = 404;
      throw error;
    }
    const data = {};
    if (updateRestrictedProductDto.customer_id) data.customerId = updateRestrictedProductDto.customer_id;
    if (updateRestrictedProductDto.product_name) data.productName = updateRestrictedProductDto.product_name;
    if (updateRestrictedProductDto.product_code) data.productCode = updateRestrictedProductDto.product_code;

    return prisma.restrictedProduct.update({
      where: { id },
      data,
    });
  },

  async remove(id) {
    const existingRestrictedProduct = await prisma.restrictedProduct.findUnique({ where: { id } });
    if (!existingRestrictedProduct) {
      const error = new Error(`Restricted Product #${id} not found`);
      error.status = 404;
      throw error;
    }
    return prisma.restrictedProduct.delete({ where: { id } });
  },
};
