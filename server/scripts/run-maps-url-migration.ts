/**
 * Apply drizzle/0001_add_contact_maps_url.sql
 * Run from server folder: npx tsx scripts/run-maps-url-migration.ts
 */
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import dotenv from "dotenv";

const serverRoot = process.cwd();

dotenv.config({ path: path.resolve(serverRoot, "../.env") });
dotenv.config({ path: path.resolve(serverRoot, ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to the repo root .env or server/.env.");
  process.exit(1);
}

const sqlPath = path.join(serverRoot, "drizzle", "0001_add_contact_maps_url.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await pool.query(sql);
  console.log("OK: maps_url column added (or already existed).");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  void pool.end();
  process.exit(1);
});
