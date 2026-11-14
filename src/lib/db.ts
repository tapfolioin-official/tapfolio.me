import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const prismaClientSingleton = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // Scaled pool size to handle concurrent analytics and support queries smoothly
    idleTimeoutMillis: 30000, // Keep idle connections alive for 30s to prevent constant cold re-handshakes
    connectionTimeoutMillis: 15000 // 15s timeout to allow serverless PostgreSQL (e.g. Neon) to wake from sleep
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// In development, ensure cached client is refreshed if new models (e.g. blogImage) were generated
if (globalThis.prismaGlobal && !(globalThis.prismaGlobal as any).blogImage) {
  try {
    globalThis.prismaGlobal.$disconnect().catch(() => {});
  } catch (e) {}
  globalThis.prismaGlobal = undefined;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
