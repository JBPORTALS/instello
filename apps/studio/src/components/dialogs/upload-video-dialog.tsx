"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@instello/ui/components/dialog";
import * as UpChunk from "@mux/upchunk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UploadVideoDialog({
  children,
  chapterId,
}: {
  children: React.ReactNode;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: createUpload } = useMutation(
    trpc.lms.video.createUpload.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.lms.video.list.queryOptions({ chapterId }),
        );
        setOpen(false);
      },
    }),
  );

  async function handleUpload(inputRef: EventTarget & HTMLInputElement) {
    try {
      const file = inputRef.files?.[0];

      if (file) {
        const { url } = await createUpload({
          title: "Untitled",
          chapterId,
        });
        const upload = UpChunk.createUpload({
          endpoint: url, // Authenticated url
          file, // File object with your video file’s properties
          chunkSize: 5120, // Uploads the file in ~5mb chunks
        });

        // Subscribe to events
        upload.on("error", (error) => {
          console.error(error.detail);
        });

        upload.on("progress", (progress) => {
          console.log(progress.detail);
        });

        upload.on("success", () => {
          console.log("Wrap it up, we're done here. 👋");
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="@container/dialog-content sm:max-w-3xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>

        <DialogBody className="@sm:min-h-96 flex gap-5">
          <input
            type="file"
            onChange={async (e) => {
              await handleUpload(e.target);
            }}
          />
        </DialogBody>
        <DialogFooter className="sm:justify-start">
          <p className="text-muted-foreground text-sm">
            By uploading you will agree to our terms and condition for the
            content you will upload
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
