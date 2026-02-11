// ===== Lotto Key System - Hono API Server (Entry Point) =====
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Route imports
import auth from './routes/auth.routes.js';
import users from './routes/users.routes.js';
import customers from './routes/customers.routes.js';
import transactions from './routes/transactions.routes.js';
import settings from './routes/settings.routes.js';
import restricted from './routes/restricted.routes.js';
import betTypes from './routes/betTypes.routes.js';
import summary from './routes/summary.routes.js';
import products from './routes/products.routes.js';
import coupons from './routes/coupons.routes.js';
import purchases from './routes/purchases.routes.js';
import purchaseLimits from './routes/purchaseLimits.routes.js';
import percentAllocations from './routes/percentAllocations.routes.js';
import restrictedProducts from './routes/restrictedProducts.routes.js';
import userCoupons from './routes/userCoupons.routes.js';
import keepId from './routes/keepId.routes.js';
import lotteryTypes from './routes/lotteryTypes.routes.js';
import rounds from './routes/rounds.routes.js';
import swagger from './routes/swagger.routes.js';

const app = new Hono();

// CORS - Enhanced configuration for credentials support
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  exposeHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400,
  credentials: true,
}));

// Route registration
app.route('/api/auth', auth);
app.route('/api/users', users);
app.route('/api/customers', customers);
app.route('/api/transactions', transactions);
app.route('/api/settings', settings);
app.route('/api/restricted', restricted);
app.route('/api/bet-types', betTypes);
app.route('/api/summary', summary);
app.route('/api/products', products);
app.route('/api/coupons', coupons);
app.route('/api/purchases', purchases);
app.route('/api/purchase-limits', purchaseLimits);
app.route('/api/percent-allocations', percentAllocations);
app.route('/api/restricted-products', restrictedProducts);
app.route('/api/user-coupons', userCoupons);
app.route('/api/keep-id', keepId);
app.route('/api/lottery-types', lotteryTypes);
app.route('/api/rounds', rounds);

//swagger on router
app.route('/api/doc', swagger);

// Start server
const PORT = process.env.PORT || 3001;

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Lotto API Server running at http://localhost:${info.port}`);
  console.log(`Prisma ORM + SQLite ready`);
});
