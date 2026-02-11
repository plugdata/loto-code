import { Hono } from 'hono';
import { productsService } from '../services/products.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const products = new Hono();

products.use('*', authMiddleware);

// GET /products ห
products.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const productData = await productsService.findAll();
    return c.json(productData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /products/:id
products.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingProduct = await productsService.findOne(id);
    return c.json(existingProduct, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /products/create
products.post('/create', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newProduct = await productsService.create(body);
    return c.json({
      message: 'Product has been created successfully',
      newProduct,
    }, 201);
  } catch (err) {
    return c.json({
      statusCode: 400,
      message: 'Error: Product not created!',
      error: 'Bad Request',
    }, err.status || 400);
  }
});

// PATCH /products/:id
products.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existingProduct = await productsService.update(id, body);
    return c.json({
      message: 'Product has been successfully updated',
      existingProduct,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

// DELETE /products/:id
products.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const deletedProduct = await productsService.remove(id);
    return c.json({
      message: 'Product deleted successfully',
      deletedProduct,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default products;
