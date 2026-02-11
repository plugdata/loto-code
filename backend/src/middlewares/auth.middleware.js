import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';

export const authMiddleware = async (c, next) => {
  const token = getCookie(c, 'access_token');

  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_key');
    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid token' }, 401);
  }
};

export const requirePerm = (permission) => {
  return async (c, next) => {
    const user = c.get('user');

    if (!user || !user.permissions || !user.permissions.includes(permission)) {
      return c.json({
        success: false,
        message: 'Forbidden: You do not have the required permission'
      }, 403);
    }

    await next();
  };
};

export const publicRoute = (c) => {
  return true;
};
