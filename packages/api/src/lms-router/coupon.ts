import { eq } from "@instello/db";
import {
  coupon,
  couponTarget,
  CreateCouponSchema,
  CreateCouponTargetSchema,
} from "@instello/db/lms";
import z from "zod/v4";

import { protectedProcedure } from "../trpc";

export const couponRouter = {
  create: protectedProcedure
    .input(CreateCouponSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(coupon)
        .values({
          ...input,
          validFrom: input.valid.from,
          validTo: input.valid.to,
        })
        .returning(),
    ),

  list: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.coupon.findMany({
        where: (t, { eq }) => eq(t.channelId, input.channelId),
        orderBy: (t, { desc }) => [desc(t.createdAt), desc(t.updatedAt)],
      }),
    ),

  delete: protectedProcedure
    .input(z.object({ couponId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.delete(coupon).where(eq(coupon, input.couponId)),
    ),

  addTarget: protectedProcedure
    .input(CreateCouponTargetSchema)
    .mutation(({ ctx, input }) => ctx.db.insert(couponTarget).values(input)),

  deleteTarget: protectedProcedure
    .input(z.object({ couponTargetId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.delete(couponTarget).where(eq(coupon, input.couponTargetId)),
    ),
};
