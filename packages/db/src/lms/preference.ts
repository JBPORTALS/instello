import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { courseOrBranch } from "./course-or-branch";

export const preference = lmsPgTable("preference", (d) => ({
  ...initialColumns,
  courseId: d
    .text()
    .notNull()
    .references(() => courseOrBranch.id, { onDelete: "cascade" }),
  branchId: d
    .text()
    .notNull()
    .references(() => courseOrBranch.id, { onDelete: "cascade" }),
}));

export const CreatePreferenceSchema = createInsertSchema(preference, {
  courseId: z.string().min(2, "Course ID required"),
  branchId: z.string().min(2, "Branch ID required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePreferenceSchema = createUpdateSchema(preference, {
  courseId: z.string().min(2, "Course ID required"),
  branchId: z.string().min(2, "Branch ID required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const preferenceRealations = relations(preference, ({ one }) => ({
  course: one(courseOrBranch, {
    fields: [preference.courseId],
    references: [courseOrBranch.courseId],
  }),
  branch: one(courseOrBranch, {
    fields: [preference.courseId],
    references: [courseOrBranch.id],
  }),
}));
