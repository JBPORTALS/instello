import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { chapter } from "./chapter";

export const video = lmsPgTable("video", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  chapterId: d
    .text()
    .notNull()
    .references(() => chapter.id),
  title: d.varchar({ length: 100 }).notNull(),
  description: d.varchar({ length: 5000 }),
  uploadId: d.text().notNull(),
  assetId: d.text(),
  playbackId: d.text(),
  duration: d.integer(),
  status: d
    .text({
      enum: [
        "errored",
        "waiting",
        "asset_created",
        "cancelled",
        "timed_out",
        "ready",
      ],
    })
    .notNull(),
  isPublished: d.boolean().default(false),
}));

export const CreateVideoSchema = createInsertSchema(video, {
  title: z
    .string()
    .min(2, "Title of the video should be atlease 2 letters long.")
    .max(100, "Title is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
}).omit({
  id: true,
  isPublished: true,
  createdByClerkUserId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateVideoSchema = createUpdateSchema(video, {
  title: z
    .string()
    .min(2, "Title of the video should be atlease 2 letters long.")
    .max(100, "Title is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
  isPublished: z.boolean(),
}).omit({
  id: true,
  chapterId: true,
  assetId: true,
  uploadId: true,
  playbackId: true,
  status: true,
  createdByClerkUserId: true,
  createdAt: true,
  updatedAt: true,
});

export const videoRealations = relations(video, ({ one }) => ({
  chapter: one(chapter, {
    fields: [video.chapterId],
    references: [chapter.id],
  }),
}));
