import { eq } from "@instello/db";
import { CreateVideoSchema, video } from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const videoRouter = {
  create: protectedProcedure
    .input(CreateVideoSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(video)
        .values({ ...input, createdByClerkUserId: ctx.auth.userId });
    }),

  getUploadUrl: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.mux.video.uploads.create({
        cors_origin: "*",
        new_asset_settings: { playback_policies: ["public"] },
      }),
  ),

  list: protectedProcedure.input(z.object({ chapterId: z.string() })).query(
    async ({ ctx, input }) =>
      await ctx.db.query.video.findMany({
        where: eq(video.chapterId, input.chapterId),
      }),
  ),
};
