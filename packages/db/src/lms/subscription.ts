import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { channel } from "./channel";

export const subscription = lmsPgTable("subscription", (d) => ({
  ...initialColumns,
  channelId: d.text().references(() => channel.id, { onDelete: "cascade" }),
  clerkUserId: d.text().notNull(),
  startDate: d.timestamp().notNull(),
  endDate: d.timestamp().notNull(),
}));

export const CreateSubscriptionSchema = createInsertSchema(subscription, {
  channelId: z.string().min(2, "Channel ID required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  channel: one(channel, {
    fields: [subscription.channelId],
    references: [channel.id],
  }),
}));
