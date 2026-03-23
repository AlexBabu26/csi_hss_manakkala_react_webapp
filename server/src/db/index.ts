import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import * as relations from "./relations";
import { loadEnv } from "../env";

loadEnv();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Database connections will fail.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, {
  schema: { ...schema, ...relations },
});

/**
 * Backward-compatible raw query helper.
 * Use `db` (Drizzle) for new code; this exists for incremental migration.
 */
export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);
