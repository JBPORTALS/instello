import { relations } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { channel } from "./channel";

export const coupon = lmsPgTable("coupon", (d) => ({
  ...initialColumns,
  channelId: d.text().references(() => channel.id, { onDelete: "cascade" }),
  type: d
    .text({ enum: ["general", "targeted"] })
    .notNull()
    .default("general"),
  code: d.varchar({ length: 100 }).notNull(),
  validFrom: d.timestamp().notNull(),
  validTo: d.timestamp().notNull(),
  maxRedemptions: d.integer().notNull(),
  subscriptionDurationDays: d.integer().notNull(),
}));

// If coupon type will be targeted then the users will defined in here
export const couponTarget = lmsPgTable(
  "coupon_target",
  (d) => ({
    ...initialColumns,
    couponId: d
      .text()
      .notNull()
      .references(() => coupon.id, { onDelete: "cascade" }),
    email: d.text().notNull(),
  }),
  (self) => [uniqueIndex().on(self.couponId, self.email)],
);

// Coupon redemption history
export const couponRedemption = lmsPgTable("coupon_redemption", (d) => ({
  ...initialColumns,
  couponId: d
    .text()
    .notNull()
    .references(() => coupon.id, { onDelete: "cascade" }),
  clerkUserId: d.text().notNull(),
}));

export const CreateCouponSchema = createInsertSchema(coupon, {
  channelId: z.string().min(2, "Channel ID required"),
  code: z
    .string()
    .min(1, "Coupon code required")
    .transform((val) => val.toUpperCase()),
})
  .omit({
    id: true,
    validFrom: true,
    validTo: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(z.object({ valid: z.object({ from: z.date(), to: z.date() }) }));

export const UpdateCouponSchema = createUpdateSchema(coupon, {
  id: z.string().min(2, "Coupon ID required"),
  code: z
    .string()
    .min(1, "Coupon code required")
    .transform((val) => val.toUpperCase()),
})
  .omit({
    id: true,
    validFrom: true,
    validTo: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(z.object({ valid: z.object({ from: z.date(), to: z.date() }) }));

export const CreateCouponTargetSchema = createInsertSchema(couponTarget, {
  couponId: z.string().min(2, "CouponId ID required"),
  email: z.string().min(2, "Email of student is required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/** Relations */

export const couponRealations = relations(coupon, ({ many }) => ({
  couponTargets: many(couponTarget),
  couponRedemptions: many(couponRedemption),
}));

export const couponTargetRealations = relations(couponTarget, ({ one }) => ({
  coupon: one(coupon, {
    fields: [couponTarget.couponId],
    references: [coupon.id],
  }),
}));

export const couponRedemptionRelations = relations(
  couponRedemption,
  ({ one }) => ({
    coupon: one(coupon, {
      fields: [couponRedemption.couponId],
      references: [coupon.id],
    }),
  }),
);
