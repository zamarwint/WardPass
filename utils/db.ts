// lib/db/client.ts
import { PrismaNeonHttp } from "@prisma/adapter-neon"; // ← no neon import needed
import { PrismaClient } from "./generated/prisma/client";

const isDev = process.env.NODE_ENV === "development";

const prismaClientSingleton = () => {
  // ✅ Pass the connection string directly + empty options object
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});

  return new PrismaClient({
    adapter,
    log: isDev ? ["error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (isDev) globalThis.prismaGlobal = prisma;