import { couponRedemption, subscription } from "@instello/db/lms";
import { TRPCError } from "@trpc/server";
import { addDays, endOfDay, isWithinInterval } from "date-fns";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const subscriptionRouter = {
  create: protectedProcedure
    .input(z.object({ couponId: z.string() }))
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        try {
          // 1. Check the redemption before proceeding further
          const userCouponRedemption =
            await tx.query.couponRedemption.findFirst({
              where: (t, { eq, and }) =>
                and(
                  eq(t.clerkUserId, ctx.auth.userId),
                  eq(t.couponId, input.couponId),
                ),
            });

          if (userCouponRedemption)
            throw new TRPCError({
              message: "Coupon already been claimed",
              code: "BAD_REQUEST",
            });

          // 2. Get the coupon details
          const channelCoupon = await tx.query.coupon.findFirst({
            where: (t, { eq }) => eq(t.id, input.couponId),
          });

          if (!channelCoupon)
            throw new TRPCError({
              message: "Coupon doesn't exists",
              code: "BAD_REQUEST",
            });

          // 3. Create subscription for user
          const userSubscription = await tx
            .insert(subscription)
            .values({
              clerkUserId: ctx.auth.userId,
              channelId: channelCoupon.channelId,
              startDate: new Date(),
              endDate: endOfDay(
                addDays(new Date(), channelCoupon.subscriptionDurationDays),
              ),
            })
            .returning()
            .then((r) => r[0]);

          if (!userSubscription)
            throw new TRPCError({
              message: "Couldn't able to process now",
              code: "BAD_REQUEST",
            });

          // 4. Store coupon redemption by user
          await tx.insert(couponRedemption).values({
            clerkUserId: ctx.auth.userId,
            couponId: channelCoupon.id,
          });

          return userSubscription;
        } catch (e) {
          throw new TRPCError({
            message: "Unable to process now, try again later",
            code: "INTERNAL_SERVER_ERROR",
            cause: e,
          });
        }
      }),
    ),

  getById: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.subscription.findFirst({
        where: (t, { eq, and }) =>
          and(
            eq(t.id, input.subscriptionId),
            eq(t.clerkUserId, ctx.auth.userId),
          ),

        with: {
          channel: true,
        },
      }),
    ),

  getByChannelId: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userSubscription = await ctx.db.query.subscription.findFirst({
        where: (t, { eq, and }) =>
          and(
            eq(t.clerkUserId, ctx.auth.userId),
            eq(t.channelId, input.channelId),
          ),

        orderBy: (t, { desc }) => desc(t.createdAt),
      });

      let status: "subscribed" | "expired" | undefined;

      if (
        userSubscription &&
        isWithinInterval(new Date(), {
          start: userSubscription.startDate,
          end: userSubscription.endDate,
        })
      ) {
        status = "subscribed";
      } else {
        status = "expired";
      }

      return {
        ...userSubscription,
        status,
      };
    }),
};
