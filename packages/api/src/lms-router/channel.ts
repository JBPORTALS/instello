import { and, countDistinct, eq } from "@instello/db";
import {
  channel,
  chapter,
  CreateChannelSchema,
  UpdateChannelSchema,
} from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const channelRouter = {
  create: protectedProcedure
    .input(CreateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(channel)
        .values({ ...input, createdByClerkUserId: ctx.auth.userId })
        .returning();
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.channel.findMany({
      where: eq(channel.createdByClerkUserId, ctx.auth.userId),
      orderBy: (col, { desc }) => desc(col.createdAt),
    });
  }),

  getById: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Get the channel details
        const singleChannel = await tx.query.channel.findFirst({
          where: and(
            eq(channel.createdByClerkUserId, ctx.auth.userId),
            eq(channel.id, input.channelId),
          ),
        });

        // 2. Get total published chapters in the channel
        const aggrChapter = await tx
          .select({ total: countDistinct(chapter.id).mapWith(Number) })
          .from(chapter)
          .where(
            and(
              eq(chapter.channelId, input.channelId),
              eq(chapter.isPublished, true),
            ),
          );

        return {
          ...singleChannel,
          canPublishable:
            aggrChapter[0]?.total !== 0 && !!singleChannel?.thumbneilId,
        };
      });
    }),

  update: protectedProcedure
    .input(UpdateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(channel)
        .set({ ...input })
        .where(eq(channel.id, input.id))
        .returning()
        .then((r) => r[0]);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(channel).where(eq(channel.id, input.id));
    }),
};
