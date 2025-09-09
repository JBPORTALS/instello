"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useUploadWorker } from "@/workers/useUploadWorker";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@instello/ui/components/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UploadVideoDialog({
  children,
  chapterId,
}: {
  children: React.ReactNode;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);
  const { startUpload, onMessage } = useUploadWorker();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: createUpload } = useMutation(
    trpc.lms.video.createUpload.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.lms.video.list.queryOptions({ chapterId }),
        );
      },
    }),
  );

  onMessage((e) => {
    console.log("Upload worker message: ", e.data);
  });

  async function handleUpload(inputRef: EventTarget & HTMLInputElement) {
    try {
      const file = inputRef.files?.[0];

      if (file) {
        const { url, id } = await createUpload({
          title: "Untitled",
          chapterId,
        });
        startUpload(id, url, file);
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
