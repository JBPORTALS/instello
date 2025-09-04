import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { channel } from "./channel";

export const chapter = lmsPgTable("chapter", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  title: d.text().notNull(),
  channelId: d
    .text()
    .notNull()
    .references(() => channel.id),
}));

export const CreateChapterSchema = createInsertSchema(chapter, {
  title: z
    .string()
    .min(3, "Title of the chapter must be atleast 2 characters long"),
}).omit({
  id: true,
  createdAt: true,
  createdByClerkUserId: true,
  updatedAt: true,
});

export const UpdateChapterSchema = createUpdateSchema(chapter, {
  id: z.string().min(1, "Chapter ID is required for updation"),
  title: z
    .string()
    .min(3, "Title of the chapter must be atlease 2 characters long"),
}).omit({
  createdAt: true,
  channelId: true,
  createdByClerkUserId: true,
  updatedAt: true,
});
