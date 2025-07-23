import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { branch } from "./branch";

export const subject = pgTable("subject", (t) => ({
  ...initialColumns,
  name: t.text().notNull(),
  semesterValue: t.numeric({ mode: "number" }).notNull(),
  branchId: t
    .text()
    .notNull()
    .references(() => branch.id, { onDelete: "cascade" }),
  staffClerkUserId: t.text(),
}));

export const CreateSubjectSchema = createInsertSchema(subject, {
  name: z.string(),
}).omit({
  id: true,
  semesterValue: true,
  staffClerkUserId: true,
  branchId: true,
  createdAt: true,
  updatedAt: true,
});
