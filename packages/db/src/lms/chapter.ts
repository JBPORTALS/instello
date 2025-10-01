import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { channel } from "./channel";
import { video } from "./video";

export const chapter = lmsPgTable("chapter", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  title: d.text().notNull(),
  channelId: d
    .text()
    .notNull()
    .references(() => channel.id, { onDelete: "cascade" }),
  order: d.integer().notNull(),
  isPublished: d.boolean().default(false),
}));

export const CreateChapterSchema = createInsertSchema(chapter, {
  title: z
    .string()
    .min(3, "Title of the chapter must be atleast 2 characters long"),
}).omit({
  id: true,
  createdAt: true,
  isPublished: true,
  createdByClerkUserId: true,
  updatedAt: true,
  order: true,
});

export const UpdateChapterSchema = createUpdateSchema(chapter, {
  id: z.string().min(1, "Chapter ID is required for updation"),
  title: z
    .string()
    .min(3, "Title of the chapter must be atlease 2 characters long")
    .optional(),
  isPublished: z.boolean().optional(),
}).omit({
  createdAt: true,
  channelId: true,
  createdByClerkUserId: true,
  updatedAt: true,
});

export const chapterRealations = relations(chapter, ({ many, one }) => ({
  videos: many(video),
  channel: one(channel, {
    fields: [chapter.channelId],
    references: [channel.id],
  }),
}));
