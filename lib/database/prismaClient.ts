import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const log: Object =
  process.env.NODE_ENV === "production"
    ? {}
    : { log: ["query", "info", "warn", "error"] };

const client = globalThis.prisma || new PrismaClient(log);

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
