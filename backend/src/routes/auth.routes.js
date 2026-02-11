import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { authService } from '../services/auth.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const auth = new Hono();

// POST /auth/login - Public
auth.post('/login', async (c) => {
  const body = await c.req.json();
  const { username, password } = body;

  const user = await authService.validateUser(username, password);
  if (!user) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  const result = await authService.login(user);

  setCookie(c, 'access_token', result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: 3600,
  });

  return c.json({ success: true, data: result }, 200);
});

// POST /auth/register - Public
auth.post('/register', async (c) => {
  const body = await c.req.json();
  try {
    const user = await authService.register(body);
    return c.json({ success: true, data: user }, 201);
  } catch (error) {
    if (error.message === 'Username already exists') {
      return c.json({ message: 'Username already exists' }, 409);
    }
    return c.json({ message: 'Registration failed' }, 500);
  }
});

// GET /auth/profile - Protected
auth.get('/profile', authMiddleware, async (c) => {
  const user = c.get('user');
  return c.json({ success: true, data: user });
});

// POST /auth/logout - Protected
auth.post('/logout', authMiddleware, async (c) => {
  const user = c.get('user');
  if (user && user.id) {
    await authService.logout(user.id);
  }
  deleteCookie(c, 'access_token');
  return c.text('OK', 200);
});

export default auth;
