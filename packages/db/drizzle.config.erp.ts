import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

// Neon database pooling url
const nonPoolingUrl = process.env.DATABASE_URL;

export default {
  schema: "./src/erp",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
  casing: "snake_case",
  out: "./drizzle/erp",
  tablesFilter: "erp_*",
} satisfies Config;
