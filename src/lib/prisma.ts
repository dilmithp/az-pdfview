import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // In Prisma 7, you might not need to pass the URL here if prisma.config.ts is used during generate,
    // but the client might still need it from env at runtime.
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
