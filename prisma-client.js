import { PrismaClient } from '@prisma/client';

let prisma;

// Make sure that we're only using one instance to prevent execeeding the db connection pool
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
