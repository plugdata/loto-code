import { Hono } from 'hono';
import { restrictedProductsService } from '../services/restrictedProducts.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const restrictedProducts = new Hono();

restrictedProducts.use('*', authMiddleware);

// GET /restricted-products
restrictedProducts.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const restrictedProductData = await restrictedProductsService.findAll();
    return c.json(restrictedProductData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /restricted-products/:id
restrictedProducts.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingRestrictedProduct = await restrictedProductsService.findOne(id);
    return c.json(existingRestrictedProduct, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /restricted-products/create
restrictedProducts.post('/create', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newRestrictedProduct = await restrictedProductsService.create(body);
    return c.json({
      message: 'Restricted Product has been created successfully',
      newRestrictedProduct,
    }, 201);
  } catch (err) {
    return c.json({
      statusCode: 400,
      message: 'Error: Restricted Product not created!',
      error: 'Bad Request',
    }, err.status || 400);
  }
});

// PATCH /restricted-products/:id
restrictedProducts.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existingRestrictedProduct = await restrictedProductsService.update(id, body);
    return c.json({
      message: 'Restricted Product has been successfully updated',
      existingRestrictedProduct,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

// DELETE /restricted-products/:id
restrictedProducts.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const deletedRestrictedProduct = await restrictedProductsService.remove(id);
    return c.json({
      message: 'Restricted Product deleted successfully',
      deletedRestrictedProduct,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default restrictedProducts;
