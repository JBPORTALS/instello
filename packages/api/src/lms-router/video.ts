import { and, asc, desc, eq, getTableColumns } from "@instello/db";
import {
  channel,
  chapter,
  CreateVideoSchema,
  UpdateVideoSchema,
  video,
} from "@instello/db/lms";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import type { withTx } from "../router.helpers";
import type { Context } from "../trpc";
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

  listPublicByChannelId: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const videos = await ctx.db
        .select({
          videoDescription: video.description,
          chapterTitle: chapter.title,
          ...getTableColumns(video),
        })
        .from(video)
        .leftJoin(
          chapter,
          and(eq(video.chapterId, chapter.id), eq(chapter.isPublished, true)),
        )
        .leftJoin(channel, eq(chapter.channelId, channel.id))
        .where(
          and(eq(channel.id, input.channelId), eq(video.isPublished, true)),
        )
        .orderBy(() => [asc(chapter.order), desc(video.createdAt)]); // if you have ordering fields

      // Group videos under chapters
      const grouped: (string | (typeof videos)[number])[] = [];
      let lastChapterId: string | null = null;

      for (const row of videos) {
        if (row.chapterId !== lastChapterId) {
          grouped.push(row.chapterTitle ?? "Untitled Chapter");
          lastChapterId = row.chapterId;
        }
        grouped.push(row);
      }

      return grouped;
    }),

  update: protectedProcedure
    .input(UpdateVideoSchema.and(z.object({ videoId: z.string().min(1) })))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(video)
        .set({ ...input })
        .where(eq(video.id, input.videoId))
        .returning()
        .then((r) => r.at(0));
    }),

  getById: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const singleVideo = await ctx.db.query.video.findFirst({
        where: eq(video.id, input.videoId),
        with: {
          chapter: true,
        },
      });

      if (!singleVideo)
        throw new TRPCError({ message: "No video found", code: "NOT_FOUND" });

      return singleVideo;
    }),

  delete: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => await deleteVideo(input, ctx)),
};

export function deleteVideo(
  input: { videoId: string },
  ctx: Context | ReturnType<typeof withTx>,
) {
  return ctx.db.transaction(async (tx) => {
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

    await tx.delete(video).where(eq(video.id, input.videoId));

    await ctx.mux.video.assets.delete(singleVideo.assetId);

    return singleVideo;
  });
}
