import { and, countDistinct, eq } from "@instello/db";
import {
  channel,
  chapter,
  CreateChannelSchema,
  UpdateChannelSchema,
} from "@instello/db/lms";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { withTx } from "../router.helpers";
import { protectedProcedure } from "../trpc";
import { deleteChapter } from "./chapter";

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
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        try {
          // 1. Find all the chapters in the channel
          const allVideos = await tx.query.chapter.findMany({
            where: eq(chapter.channelId, input.channelId),
          });

          // 2. Delete all video assets in the chapter
          await Promise.all(
            allVideos.map(
              async (chapter) =>
                await deleteChapter({ chapterId: chapter.id }, withTx(ctx, tx)),
            ),
          );

          // 3. Delete the channel
          const deletedChannel = await tx
            .delete(channel)
            .where(eq(channel.id, input.channelId))
            .returning()
            .then((r) => r[0]);

          if (!deletedChannel) {
            throw new TRPCError({
              message: "Unable to delete the channel",
              code: "INTERNAL_SERVER_ERROR",
            });
          }

          return deletedChannel;
        } catch (e) {
          console.error("delete:chapter:error: ", e);
          throw new TRPCError({
            message: "Unable to delete the chapter",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      });
    }),
};
