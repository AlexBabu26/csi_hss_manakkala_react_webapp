#!/usr/bin/env node
/**
 * List all blobs in the linked Vercel Blob store and download them into a
 * local directory (default: ./blob-backup). Preserves pathnames as subpaths.
 *
 * Requires: BLOB_READ_WRITE_TOKEN in environment (or .env in repo root).
 * Run from repo root: node scripts/vercel-blob-download.mjs
 */

import { list } from "@vercel/blob";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const backupDir = process.env.BLOB_BACKUP_DIR
  ? join(rootDir, process.env.BLOB_BACKUP_DIR)
  : join(rootDir, "blob-backup");

function loadEnv() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

async function downloadToFile(url, filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filePath, buffer);
}

async function run() {
  loadEnv();
  const t = process.env.BLOB_READ_WRITE_TOKEN;
  if (!t) {
    console.error(
      "Missing BLOB_READ_WRITE_TOKEN. Set it in .env or run:\n  BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx node scripts/vercel-blob-download.mjs"
    );
    process.exit(1);
  }

  let cursor;
  let total = 0;
  const limit = 500;

  console.log("Listing blobs and downloading to:", backupDir);

  do {
    const result = await list({
      limit,
      cursor,
      token: t,
    });

    for (const blob of result.blobs) {
      const url = blob.url || blob.downloadUrl;
      if (!url) {
        console.warn("No URL for blob:", blob.pathname);
        continue;
      }
      const localPath = join(backupDir, blob.pathname);
      try {
        await downloadToFile(url, localPath);
        total++;
        console.log("  ", blob.pathname);
      } catch (err) {
        console.error("  FAIL", blob.pathname, err.message);
      }
    }

    if (result.hasMore && result.cursor) {
      cursor = result.cursor;
    } else {
      cursor = null;
    }
  } while (cursor);

  console.log("\nDone. Downloaded", total, "file(s) to", backupDir);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
