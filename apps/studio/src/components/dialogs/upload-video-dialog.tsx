"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { uploadManager } from "@/store/UploadManager";
import { useTRPC } from "@/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@instello/ui/components/breadcrumb";
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
import { cn } from "@instello/ui/lib/utils";
import { FileArrowUpIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UploadVideoDialog({
  children,
  chapterId,
  chapterName,
}: {
  children: React.ReactNode;
  chapterId: string;
  chapterName: string;
}) {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createUpload, isPending } = useMutation(
    trpc.lms.video.createUpload.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.lms.video.list.queryOptions({ chapterId }),
        );
        setOpen(false);
      },
    }),
  );

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      try {
        // Create video in database first (this also creates the Mux upload)
        const { url, id } = await createUpload({
          title: selectedFile.name,
          chapterId,
        });

        // Start the upload using UploadManager with the database video ID
        uploadManager.startUpload({
          videoId: id, // This is the same ID used in the database
          file: selectedFile,
          endpoint: url,
          onProgress: (progress, uploadedBytes) => {
            console.log(
              `Upload progress: ${progress}% (${uploadedBytes} bytes)`,
            );
          },
          onSuccess: (response) => {
            console.log("Upload completed successfully:", response);
          },
          onError: (error) => {
            console.error("Upload failed:", error);
          },
        });
      } catch (error) {
        console.error("Failed to start upload:", error);
      }
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
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>{chapterName}</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DialogTitle className="text-sm" asChild>
                  <BreadcrumbPage>Upload Video</BreadcrumbPage>
                </DialogTitle>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DialogHeader>

        <DialogBody className="@sm:min-h-96 flex flex-col items-center justify-center gap-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="w-full"
            hidden
            disabled={isPending}
          />
          <div className="size-30 bg-muted relative flex items-center justify-center rounded-full">
            {isPending ? (
              <Image
                src={"/loading-rocket.gif"}
                className="scale-150"
                alt="Loading Rocket"
                fill
              />
            ) : (
              <FileArrowUpIcon
                weight="fill"
                className="text-muted-foreground size-14"
              />
            )}
          </div>
          <p
            className={cn(
              "text-muted-foreground max-w-xs text-center text-sm",
              isPending && "opacity-90",
            )}
          >
            Select a file to start uploading. Your video will be private until
            you publish them.
          </p>
          <Button
            className="rounded-full"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
        </DialogBody>

        <DialogFooter className="sm:justify-between">
          <p className="text-muted-foreground w-full text-center text-xs">
            By uploading you will agree to our terms and condition for the
            content you will upload
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
