"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { Button } from "@instello/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@instello/ui/components/dialog";
import { Spinner } from "@instello/ui/components/spinner";
import MuxUploader from "@mux/mux-uploader-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  const {
    data: upload,
    isLoading,
    isError,
  } = useQuery(
    trpc.lms.video.getUploadUrl.queryOptions(undefined, { enabled: open }),
  );

  const { mutateAsync: createVideo } = useMutation(
    trpc.lms.video.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.lms.video.list.queryOptions({ chapterId }),
        );
        setOpen(false);
      },
    }),
  );

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
        {isLoading ? (
          <DialogBody className="flex min-h-80 items-center justify-center">
            <Spinner className="size-8" />
          </DialogBody>
        ) : (
          <>
            <DialogBody className="@sm:min-h-96 flex gap-5">
              {isError || !upload ? (
                <div>Something went wrong, try to reopen it again.</div>
              ) : (
                <MuxUploader
                  endpoint={upload.url}
                  style={
                    {
                      "--overlay-background-color": "var(--background)",
                      "--progress-bar-fill-color": "var(--foreground)",
                      "--progress-percentage-display": "var(--foreground)",
                    } as React.CSSProperties
                  }
                  className="w-full"
                  pausable
                  onSuccess={async () => {
                    await createVideo({
                      chapterId,
                      uploadId: upload.id,
                      title: "Untitled",
                    });
                  }}
                >
                  <Button slot="file-select">Select File</Button>
                </MuxUploader>
              )}
            </DialogBody>
            <DialogFooter className="sm:justify-start">
              <p className="text-muted-foreground text-sm">
                By uploading you will agree to our terms and condition for the
                content you will upload
              </p>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
