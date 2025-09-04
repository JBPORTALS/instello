import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { channel } from "./channel";
import { chapter } from "./chapter";

export const video = lmsPgTable("video", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  channelId: d
    .text()
    .notNull()
    .references(() => channel.id),
  chapterId: d
    .text()
    .notNull()
    .references(() => chapter.id),
  title: d.varchar({ length: 256 }).notNull(),
  description: d.text(),
  duration: d.real().notNull(),
  utFileKey: d.text().notNull(),
  viewCount: d.integer().default(0),
  isPublished: d.boolean().default(false),
}));

export const CreateVideoSchema = createInsertSchema(video, {
  title: z
    .string()
    .min(3, "Title of the video must be atleast 2 characters long"),
}).omit({
  id: true,
  viewCount: true,
  isPublished: true,
  createdAt: true,
  createdByClerkUserId: true,
  updatedAt: true,
});

export const UpdateVideoSchema = createUpdateSchema(video, {
  id: z.string().min(1, "Video ID is required for updation"),
  title: z
    .string()
    .min(3, "Title of the video must be atlease 2 characters long"),
}).omit({
  createdAt: true,
  channelId: true,
  chapterId: true,
  viewCount: true,
  createdByClerkUserId: true,
  updatedAt: true,
});
