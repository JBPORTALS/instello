import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { erpPgTable } from "../table.helpers";
import { branch } from "./branch";
import { semester } from "./semester";

export const student = erpPgTable(
  "student",
  (t) => ({
    ...initialColumns,
    usn: t.text().notNull(),
    firstName: t.text().notNull(),
    lastName: t.text(),
    fullName: t
      .text()
      .notNull()
      .generatedAlwaysAs(
        (): SQL => sql`${student.firstName}||' '||${student.lastName}`,
      ),
    emailAddress: t.text().notNull(),
    clerkOrgId: t.text().notNull(),
    branchId: t
      .text()
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    currentSemesterId: t
      .text()
      .notNull()
      .references(() => semester.id, { onDelete: "cascade" }),
  }),
  (self) => [
    unique("usn_clerkOrgId_unique").on(self.usn, self.clerkOrgId),
    unique("emailAddress_clerkOrgId_unique").on(
      self.emailAddress,
      self.clerkOrgId,
    ),
  ],
);

export const CreateStudentSchema = createInsertSchema(student, {
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  emailAddress: z.email(),
}).omit({
  id: true,
  currentSemesterId: true,
  clerkOrgId: true,
  branchId: true,
  createdAt: true,
  updatedAt: true,
});
