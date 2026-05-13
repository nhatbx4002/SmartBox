import { PrismaClient } from '../generated/prisma';

declare global {
  var __smartboxPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__smartboxPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__smartboxPrisma = prisma;
}
