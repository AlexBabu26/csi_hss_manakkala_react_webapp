import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let envLoaded = false;

const ENV_CANDIDATES = [
  path.resolve(process.cwd(), "../.env.local"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), ".env"),
];

export function loadEnv() {
  if (envLoaded) {
    return;
  }

  for (const envPath of ENV_CANDIDATES) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }
  }

  envLoaded = true;
}
