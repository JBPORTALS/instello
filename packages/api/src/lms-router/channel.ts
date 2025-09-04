import { and, eq } from "@instello/db";
import {
  channel,
  CreateChannelSchema,
  UpdateChannelSchema,
} from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const channelRouter = {
  createChannel: protectedProcedure
    .input(CreateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(channel)
        .values({ ...input, createdByClerkUserId: ctx.auth.userId })
        .returning();
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(channel)
      .where(eq(channel.createdByClerkUserId, ctx.auth.userId));
  }),

  getById: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.channel.findFirst({
        where: and(
          eq(channel.createdByClerkUserId, ctx.auth.userId),
          eq(channel.id, input.channelId),
        ),
      });
    }),

  update: protectedProcedure
    .input(UpdateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(channel)
        .set({ ...input })
        .where(eq(channel.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(channel).where(eq(channel.id, input.id));
    }),
};
