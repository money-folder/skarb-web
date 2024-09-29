import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-expect-error -- Without keeping the same reference to the Prisma client in Next.js, it'll recreate it on each source code reload in development mode
  if (!global.prisma) {
    // @ts-expect-error -- same
    global.prisma = new PrismaClient();
  }

  // @ts-expect-error -- same
  prisma = global.prisma;
}

export { prisma };
