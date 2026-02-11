// ===== Users Service (Factory + bcrypt) =====
import bcrypt from 'bcryptjs';
import { prisma } from '../db/connection.js';
import { createCrudService } from '../utils/serviceFactory.js';

const crud = createCrudService('user');

export const usersService = {
  ...crud,

  async findByUserName(username) {
    return prisma.user.findUnique({ where: { username } });
  },

  async create(createUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
        displayName: createUserDto.displayName || createUserDto.username,
        phone: createUserDto.phone || '',
        lineId: createUserDto.lineId || '',
        role: createUserDto.role || 'customer',
        status: 'offline'
      },
    });
  },
};
