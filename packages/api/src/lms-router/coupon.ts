import { countDistinct, eq } from "@instello/db";
import {
  coupon,
  couponRedemption,
  couponTarget,
  CreateCouponSchema,
  CreateCouponTargetSchema,
  UpdateCouponSchema,
} from "@instello/db/lms";
import { TRPCError } from "@trpc/server";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
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
      ctx.db.query.coupon
        .findMany({
          where: (t, { eq }) => eq(t.channelId, input.channelId),
          orderBy: (t, { desc }) => [desc(t.createdAt), desc(t.updatedAt)],
        })
        .then((r) =>
          r.map(({ validTo, validFrom, ...c }) => ({
            ...c,
            valid: { to: validTo, from: validFrom },
          })),
        ),
    ),

  check: protectedProcedure
    .input(z.object({ code: z.string().trim(), channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        //1. Check weather coupon exists or not
        const channelCoupon = await tx.query.coupon.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.channelId, input.channelId), eq(t.code, input.code)),
        });

        if (!channelCoupon)
          throw new TRPCError({
            message: `Enter valid coupon code`,
            code: "BAD_REQUEST",
          });

        // 2. check weather coupon validity existis or not
        const validFrom = startOfDay(channelCoupon.validFrom);
        const validTo = endOfDay(channelCoupon.validTo);

        if (
          !isWithinInterval(new Date(Date.now()), {
            start: validFrom,
            end: validTo,
          })
        )
          throw new TRPCError({
            message: "Coupon validity expired",
            code: "BAD_REQUEST",
          });

        // 3. Check for coupon's maximum redemption of the coupon
        const redemptionCount = await tx
          .select({ count: countDistinct(couponRedemption.clerkUserId) })
          .from(couponRedemption)
          .where(eq(couponRedemption.couponId, channelCoupon.id))
          .then((r) => r[0]?.count ?? 0);

        if (redemptionCount >= channelCoupon.maxRedemptions)
          throw new TRPCError({
            message: "Coupon has been reached it's maximum claims",
            code: "BAD_REQUEST",
          });

        // 4. Check weather user has already claimed this coupon
        const redemption = await tx.query.couponRedemption.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.clerkUserId, ctx.auth.userId),
              eq(t.couponId, channelCoupon.id),
            ),
        });

        if (redemption)
          throw new TRPCError({
            message: "Coupon already been used",
            code: "BAD_REQUEST",
          });

        if (channelCoupon.type == "general") return channelCoupon;

        // 5. If the coupon type is TARGETED, then look for targets list to validate
        // the usage of this coupon by the current user
        const emailAddress = (await ctx.clerk.users.getUser(ctx.auth.userId))
          .emailAddresses[0]?.emailAddress;

        if (!emailAddress)
          throw new TRPCError({
            message: "Can't able to complete this request right now",
            cause: {
              message: `Clerk couldn't able to get the email address for the user`,
            },
            code: "INTERNAL_SERVER_ERROR",
          });

        const userCouponTarget = await tx.query.couponTarget.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.email, emailAddress), eq(t.couponId, channelCoupon.id)),
        });

        if (!userCouponTarget)
          throw new TRPCError({
            message: "Your not elligible to use this coupon, sorry",
            code: "BAD_REQUEST",
          });

        return channelCoupon;
      });
    }),

  update: protectedProcedure
    .input(UpdateCouponSchema.and(z.object({ id: z.string() })))
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(coupon)
        .set({
          ...input,
          validFrom: input.valid.from,
          validTo: input.valid.to,
        })
        .where(eq(coupon.id, input.id))
        .returning()
        .then((r) => r[0]),
    ),

  delete: protectedProcedure
    .input(z.object({ couponId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(coupon)
        .where(eq(coupon.id, input.couponId))
        .returning()
        .then((r) => r[0]),
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
