import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";

export const initialColumns = {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$defaultFn(() => sql`now()`),
};
