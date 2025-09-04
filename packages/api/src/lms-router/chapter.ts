import { and, eq } from "@instello/db";
import {
  chapter,
  CreateChapterSchema,
  UpdateChapterSchema,
} from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const chapterRouter = {
  create: protectedProcedure
    .input(CreateChapterSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(chapter)
        .values({ ...input, createdByClerkUserId: ctx.auth.userId })
        .returning();
    }),

  list: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.chapter.findMany({
        where: and(
          eq(chapter.createdByClerkUserId, ctx.auth.userId),
          eq(chapter.channelId, input.channelId),
        ),
      });
    }),

  update: protectedProcedure
    .input(UpdateChapterSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(chapter)
        .set({ ...input })
        .where(eq(chapter.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(chapter).where(eq(chapter.id, input.id));
    }),
};
