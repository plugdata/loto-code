import { Hono } from 'hono';
import { percentAllocationsService } from '../services/percentAllocations.service.js';
import { authMiddleware, requirePerm } from '../middlewares/auth.middleware.js';

const percentAllocations = new Hono();

percentAllocations.use('*', authMiddleware);

// GET /percent-allocations
percentAllocations.get('/', requirePerm('numbers.read'), async (c) => {
  try {
    const percentAllocationData = await percentAllocationsService.findAll();
    return c.json(percentAllocationData, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// GET /percent-allocations/:id
percentAllocations.get('/:id', requirePerm('numbers.read'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingPercentAllocation = await percentAllocationsService.findOne(id);
    return c.json(existingPercentAllocation, 200);
  } catch (err) {
    return c.json(err.message, err.status || 404);
  }
});

// POST /percent-allocations/create
percentAllocations.post('/create', requirePerm('numbers.create'), async (c) => {
  try {
    const body = await c.req.json();
    const newPercentAllocation = await percentAllocationsService.create(body);
    return c.json({
      message: 'Percent Allocation has been created successfully',
      newPercentAllocation,
    }, 201);
  } catch (err) {
    return c.json({
      statusCode: 400,
      message: 'Error: Percent Allocation not created!',
      error: 'Bad Request',
    }, err.status || 400);
  }
});

// PATCH /percent-allocations/:id
percentAllocations.patch('/:id', requirePerm('numbers.create'), async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existingPercentAllocation = await percentAllocationsService.update(id, body);
    return c.json({
      message: 'Percent Allocation has been successfully updated',
      existingPercentAllocation,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

// DELETE /percent-allocations/:id
percentAllocations.delete('/:id', requirePerm('numbers.delete'), async (c) => {
  try {
    const id = c.req.param('id');
    const deletedPercentAllocation = await percentAllocationsService.remove(id);
    return c.json({
      message: 'Percent Allocation deleted successfully',
      deletedPercentAllocation,
    }, 200);
  } catch (err) {
    return c.json(err.message, err.status || 400);
  }
});

export default percentAllocations;
