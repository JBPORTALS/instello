import { and, eq } from "@instello/db";
import { CreateVideoSchema, UpdateVideoSchema, video } from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const chapterRouter = {
  create: protectedProcedure
    .input(CreateVideoSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(video)
        .values({ ...input, createdByClerkUserId: ctx.auth.userId })
        .returning();
    }),

  list: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.video.findMany({
        where: and(eq(video.chapterId, input.chapterId)),
      });
    }),

  update: protectedProcedure
    .input(UpdateVideoSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(video)
        .set({ ...input })
        .where(eq(video.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(video).where(eq(video.id, input.videoId));
    }),
};
