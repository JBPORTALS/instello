import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as erpSchema from "./erp";
import * as lmsSchema from "./lms";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

export const db = drizzle({
  client: pool,
  schema: { ...erpSchema, ...lmsSchema },
  casing: "snake_case",
});
