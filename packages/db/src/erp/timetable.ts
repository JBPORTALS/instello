import { relations, sql } from "drizzle-orm";
import { check } from "drizzle-orm/gel-core";
import { createInsertSchema } from "drizzle-zod";

import { initialColumns } from "../columns.helpers";
import { erpPgTable } from "../helper";
import { branch } from "./branch";
import { semester } from "./semester";
import { subject } from "./subject";

export const timetable = erpPgTable("timetable", (t) => ({
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

export const timetableSlot = erpPgTable(
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
    staffClerkUserId: t.text(),
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
).omit({
  id: true,
  timetableId: true,
  createdAt: true,
  staffClerkUserId: true,
  updatedAt: true,
});
