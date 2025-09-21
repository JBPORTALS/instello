import { relations } from "drizzle-orm";
import { foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";

/** Courses are different from channels. In LMS couses just for mapping the students to right content,
 * this is not any important entity in LMS itself. Later studio creators can map thier content to
 * particular group of students under different courses and branches */
export const courseOrBranch = lmsPgTable(
  "course_or_branch",
  (d) => ({
    ...initialColumns,
    name: d.varchar({ length: 100 }).notNull(),
    /** If course id is not null for record then it's a branch */
    courseId: d.text(),
  }),
  (self) => [
    foreignKey({
      columns: [self.courseId],
      foreignColumns: [self.id],
    }),
  ],
);

export const courseOrBranchRelations = relations(
  courseOrBranch,
  ({ many, one }) => ({
    branches: many(courseOrBranch),
    course: one(courseOrBranch, {
      fields: [courseOrBranch.courseId],
      references: [courseOrBranch.id],
    }),
  }),
);

export const CreateCourseOrBranchSchema = createInsertSchema(courseOrBranch, {
  name: z
    .string()
    .min(3, "Title of the course or branch must be atleast 2 characters long"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCourseOrBranchSchema = createUpdateSchema(courseOrBranch, {
  id: z.string().min(1, "Course or Branch ID is required for updation"),
  name: z
    .string()
    .min(3, "name of the course or branch must be atlease 2 characters long"),
}).omit({
  createdAt: true,
  updatedAt: true,
});
