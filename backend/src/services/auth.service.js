import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/connection.js';

export const authService = {
  async validateUser(username, password) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  },

  async login(user) {
    const { ROLE_PERMISSIONS } = await import('../config/permissions.js');
    const permissions = ROLE_PERMISSIONS[user.role] || [];

    // Update status to online (Safe update, catch if column missing)
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'online' }
      });
    } catch (err) {
      console.warn('Could not update user status to online:', err.message);
    }

    const payload = {
      username: user.username,
      id: user.id,
      displayName: user.displayName, // Include displayName in token
      role: user.role,
      permissions
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET || 'my_super_secret_key', {
      expiresIn: process.env.JWT_EXPIRATION || '1d',
    });
    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        role: user.role,
        status: 'online',
        phone: user.phone || '',
        lineId: user.lineId || '',
        permissions
      }
    };
  },

  async register(createUserDto) {
    // Normalize username to lowercase for consistency
    const normalizedUsername = createUserDto.username.toLowerCase().trim();

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: normalizedUsername,
        password: hashedPassword,
        displayName: createUserDto.displayName || normalizedUsername,
        phone: createUserDto.phone || '',
        lineId: createUserDto.lineId || '',
        role: createUserDto.role || 'customer',
        status: 'offline'
      },
    });
    // Return without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async logout(userId) {
    if (!userId) return;
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { status: 'offline' }
      });
    } catch (err) {
      console.warn('Could not update user status to offline:', err.message);
    }
  },
};
