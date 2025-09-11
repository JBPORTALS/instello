import { asc, desc, eq } from "@instello/db";
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
      const last = await ctx.db.query.chapter.findFirst({
        where: eq(chapter.channelId, input.channelId),
        orderBy: desc(chapter.order),
      });

      const nextOrder = last ? last.order + 1 : 1;

      return await ctx.db
        .insert(chapter)
        .values({
          ...input,
          order: nextOrder,
          createdByClerkUserId: ctx.auth.userId,
        })
        .returning();
    }),

  list: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.chapter.findMany({
        where: eq(chapter.channelId, input.channelId),
        orderBy: asc(chapter.order),
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
