import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "./columns.helpers";

export const branch = pgTable("branch", (t) => ({
  ...initialColumns,
  name: t.text().notNull(),
  icon: t.varchar({ length: 256 }).notNull(),
  currentSemesterMode: t.text().$type<"odd" | "even">().notNull(),
  totalSemesters: t.integer().notNull(),
  clerkOrganizationId: t.text().notNull(),
}));

export const CreateBranchSchema = createInsertSchema(branch, {
  name: z.string(),
  icon: z.string(),
  totalSemesters: z.number(),
}).omit({
  id: true,
  clerkOrganizationId: true,
  createdAt: true,
  updatedAt: true,
});
