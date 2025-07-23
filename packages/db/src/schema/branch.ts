import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";

export type SemesterMode = "odd" | "even";
export const branch = pgTable("branch", (t) => ({
  ...initialColumns,
  name: t.text().notNull(),
  icon: t.varchar({ length: 256 }).notNull(),
  currentSemesterMode: t.text().$type<SemesterMode>().notNull(),
  totalSemesters: t.integer().notNull(),
  clerkOrgId: t.text().notNull(),
}));

export const CreateBranchSchema = createInsertSchema(branch, {
  name: z.string(),
  icon: z.string(),
  totalSemesters: z.number(),
  currentSemesterMode: z.enum(["odd", "even"]),
}).omit({
  id: true,
  clerkOrgId: true,
  createdAt: true,
  updatedAt: true,
});
