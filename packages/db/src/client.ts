import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

const pool = new Pool({ connectionString: process.env.POSTGRES_URL, max: 1 });

export const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
});
