import type { SQL } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";
import { check, pgTable, unique } from "drizzle-orm/pg-core";
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

export const semester = pgTable("semester", (t) => ({
  ...initialColumns,
  branchId: t
    .text()
    .notNull()
    .references(() => branch.id, { onDelete: "cascade" }),
  value: t.integer().notNull(),
  isArchived: t.boolean().notNull().default(false),
  acadYear: t
    .varchar({ length: 256 })
    .notNull()
    .$defaultFn(() => `${new Date().getFullYear()}`),
}));

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

export const student = pgTable(
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

export const timetable = pgTable("timetable", (t) => ({
  ...initialColumns,
  branchId: t
    .text()
    .notNull()
    .references(() => branch.id, { onDelete: "cascade" }),
  semesterId: t
    .text()
    .notNull()
    .references(() => semester.id, { onDelete: "cascade" }),
  version: t.integer().notNull(), // increment per batch
  published: t.boolean().default(false),
  message: t.text().notNull(), // explanation of changes
  effectiveFrom: t.timestamp({ mode: "date", withTimezone: true }).notNull(), // when it goes live
}));

export const timetableRealations = relations(timetable, ({ many }) => ({
  timetableSlots: many(timetableSlot),
}));

export const CreateTimetableSchema = createInsertSchema(timetable).omit({
  id: true,
  createdAt: true,
  published: true,
  version: true,
});

export const timetableSlot = pgTable(
  "timetable_slot",
  (t) => ({
    ...initialColumns,
    timetableId: t
      .text()
      .notNull()
      .references(() => timetable.id, { onDelete: "cascade" }),

    // timetable dimensions
    dayOfWeek: t.integer().notNull(), // 0 to 6 defining the index of the dayOfWeek list ["Monday","Tuesday",...]
    startOfPeriod: t.integer().notNull(), // at which period subject class starts
    endOfPeriod: t.integer().notNull(), // at which period subject class ends

    // content of the slot
    subjectId: t
      .text()
      .notNull()
      .references(() => subject.id, { onDelete: "cascade" }),
    staffClerkUserId: t.text().notNull(),
  }),
  (s) => [check("check_dayOfCheck", sql`${s.dayOfWeek} BETWEEN 0 AND 6`)],
);

export const timetableSlotsRealations = relations(timetableSlot, ({ one }) => ({
  timetable: one(timetable, {
    fields: [timetableSlot.timetableId],
    references: [timetable.id],
  }),
  subject: one(subject, {
    fields: [timetableSlot.subjectId],
    references: [subject.id],
  }),
}));

export const CreateTimetableSlotsSchema = createInsertSchema(
  timetableSlot,
).omit({ id: true, timetableId: true });
