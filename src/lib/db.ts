import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const prismaClientSingleton = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 4, // Limit connection pool size in development to prevent connection exhaustion
    idleTimeoutMillis: 15000, // Close idle connections quickly
    connectionTimeoutMillis: 5000 // Timeout fast instead of hanging
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
