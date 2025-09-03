import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";

export const channel = lmsPgTable("channel", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  title: d.varchar({ length: 256 }).notNull(),
  description: d.text(),
  createdAt: d.timestamp().defaultNow().notNull(),
  isPublished: d.boolean().default(false),
  thumbneilId: d.varchar({ length: 100 }),
}));

export const CreateChannelSchema = createInsertSchema(channel, {
  title: z
    .string()
    .min(3, "Title of the channel must be atlease 3 characters long"),
  description: z.string().optional(),
  thumbneilId: z.string().min(1, "Thumbneil required"),
}).omit({
  id: true,
  createdAt: true,
  createdByClerkUserId: true,
  isPublished: true,
  updatedAt: true,
});
