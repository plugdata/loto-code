import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import { swaggerDoc } from '../swagger.js';

const swagger = new Hono();

// Swagger UI at /api/swagger
swagger.get('/', swaggerUI({ url: '/api/doc/doc' }));

// Swagger JSON document at /api/swagger/doc
swagger.get('/doc', (c) => {
    return c.json(swaggerDoc);
});

export default swagger;
