import { loadEnv } from "../env";

loadEnv();

async function migrate() {
  console.error(
    "Legacy API schema migrations are not automated in this branch. The Drizzle schema under src/db/schema.ts targets a future tbl_* schema and should not be applied to the live API tables yet."
  );
  process.exit(1);
}

void migrate();
