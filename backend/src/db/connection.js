import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Connected to SQLite database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
}
