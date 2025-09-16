import type { FileRouter } from "uploadthing/next";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "@instello/db";
import { db } from "@instello/db/client";
import { channel } from "@instello/db/lms";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod/v4";

const f = createUploadthing();

const ut = new UTApi();

// FileRouter for your app, can contain multiple FileRoutes
export const studioFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  channelThumbneilUploader: f({
    "image/jpeg": {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
      minFileCount: 1,
      additionalProperties: {
        height: 720,
        width: 1280,
      },
    },
    "image/png": {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
      minFileCount: 1,
      additionalProperties: {
        height: 720,
        width: 1280,
      },
    },
    "image/avif": {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
      minFileCount: 1,
      additionalProperties: {
        height: 720,
        width: 1280,
      },
    },
    "image/webp": {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
      minFileCount: 1,
      additionalProperties: {
        height: 720,
        width: 1280,
      },
    },
  })
    .input(z.object({ channelId: z.string().min(1, "Channel Id is required") }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const { userId } = getAuth(req);

      // If you throw, the user will not be able to upload
      if (!userId)
        throw new UploadThingError({
          message: "Unauthorized",
          code: "BAD_REQUEST",
        }) as Error;

      const singleChannel = await db.query.channel.findFirst({
        where: eq(channel.id, input.channelId),
      });

      if (!singleChannel)
        throw new UploadThingError({
          message: "No channel found",
          code: "INTERNAL_SERVER_ERROR",
        }) as Error;

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, channel: singleChannel };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // 1. If already there is uploaded file delete that
      if (metadata.channel.thumbneilId) {
        await ut.deleteFiles(metadata.channel.thumbneilId);
      }

      // 2. Updae new file key to the channel row
      const updatedChannel = await db
        .update(channel)
        .set({ thumbneilId: file.key })
        .where(eq(channel.id, metadata.channel.id))
        .returning()
        .then((r) => r[0]);

      if (!updatedChannel) {
        await ut.deleteFiles(file.key);
        throw new UploadThingError({
          message: "DB not updated",
          code: "INTERNAL_SERVER_ERROR",
        }) as Error;
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.userId,
        channelId: updatedChannel.id,
        newThumbneilId: updatedChannel.thumbneilId,
      };
    }),
} satisfies FileRouter;

export type StudioFileRouter = typeof studioFileRouter;
