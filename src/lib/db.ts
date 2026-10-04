import { PrismaClient as NodePrismaClient } from "@prisma/client";
import { PrismaClient as WorkerPrismaClient } from "@prisma/client/wasm.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Cloudflare Workers must use the WASM entry: the Node entry reads the query
// compiler with fs.readFileSync, which Workers don't have. Under Node (next
// build/dev) the WASM entry can't load, because `import("*.wasm")` has no
// `default` export there, so Node keeps the standard entry.
const isWorkers =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";
const PrismaClient = isWorkers ? WorkerPrismaClient : NodePrismaClient;
type PrismaClient = InstanceType<typeof NodePrismaClient>;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
