import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "./columns.helpers";

export type SemesterMode = "odd" | "even";
export const branch = pgTable("branch", (t) => ({
  ...initialColumns,
  name: t.text().notNull(),
  icon: t.varchar({ length: 256 }).notNull(),
  currentSemesterMode: t.text().$type<SemesterMode>().notNull(),
  totalSemesters: t.integer().notNull(),
  clerkOrganizationId: t.text().notNull(),
}));

export const CreateBranchSchema = createInsertSchema(branch, {
  name: z.string(),
  icon: z.string(),
  totalSemesters: z.number(),
  currentSemesterMode: z.enum(["odd", "even"]),
}).omit({
  id: true,
  clerkOrganizationId: true,
  createdAt: true,
  updatedAt: true,
});

export const subject = pgTable("subject", (t) => ({
  ...initialColumns,
  name: t.text().notNull(),
  semester: t.numeric({ mode: "number" }).notNull(),
  branchId: t
    .text()
    .notNull()
    .references(() => branch.id),
}));

export const CreateSubjectSchema = createInsertSchema(subject, {
  name: z.string(),
}).omit({
  id: true,
  branchId: true,
  createdAt: true,
  updatedAt: true,
});
