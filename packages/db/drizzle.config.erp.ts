import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

// Neon database pooling url
const nonPoolingUrl = process.env.POSTGRES_URL;

export default {
  schema: "./src/erp",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
  casing: "snake_case",
  out: "./drizzle/erp",
  tablesFilter: "erp_*",
} satisfies Config;
