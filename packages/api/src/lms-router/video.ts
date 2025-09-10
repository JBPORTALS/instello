import { eq } from "@instello/db";
import { CreateVideoSchema, video } from "@instello/db/lms";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
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

  createUpload: protectedProcedure
    .input(CreateVideoSchema.omit({ uploadId: true, status: true }))
    .mutation(async ({ ctx, input }) => {
      const id = createId();

      const upload = await ctx.mux.video.uploads.create({
        cors_origin:
          process.env.NODE_ENV === "production"
            ? (process.env.VERCEL_URL ?? "No url found")
            : `http://localhost:${process.env.PORT}`,
        new_asset_settings: {
          playback_policies: ["public"],
          passthrough: id,
          meta: { creator_id: ctx.auth.userId, external_id: input.chapterId },
        },
        // test: process.env.NODE_ENV !== "production",
      });

      await ctx.db.insert(video).values({
        ...input,
        id,
        uploadId: upload.id,
        status: "waiting",
        createdByClerkUserId: ctx.auth.userId,
      });

      return upload;
    }),

  list: protectedProcedure.input(z.object({ chapterId: z.string() })).query(
    async ({ ctx, input }) =>
      await ctx.db.query.video.findMany({
        where: eq(video.chapterId, input.chapterId),
      }),
  ),

  delete: protectedProcedure.input(z.object({ videoId: z.string() })).mutation(
    async ({ ctx, input }) =>
      await ctx.db.transaction(async (tx) => {
        const singleVideo = await tx.query.video.findFirst({
          where: eq(video.id, input.videoId),
        });

        if (!singleVideo)
          throw new TRPCError({
            message: "Video not found",
            code: "BAD_REQUEST",
          });

        if (!singleVideo.assetId)
          throw new TRPCError({
            message: "Can't delete the video, no asset ID found.",
            code: "BAD_REQUEST",
          });

        await ctx.mux.video.assets.delete(singleVideo.assetId);

        return singleVideo;
      }),
  ),
};
