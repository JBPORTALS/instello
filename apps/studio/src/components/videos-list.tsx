"use client";

import type { UnifiedVideo } from "@/hooks/useUnifiedVideoList";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import Image from "next/image";
import {
  formatFileSize,
  formatTimeRemaining,
  formatUploadSpeed,
  useUnifiedVideoList,
} from "@/hooks/useUnifiedVideoList";
import { useUploadManager } from "@/hooks/useUploadManager";
import { Button } from "@instello/ui/components/button";
import { Skeleton } from "@instello/ui/components/skeleton";
import { cn } from "@instello/ui/lib/utils";
import { toast } from "sonner";

export function VideosList({ chapterId }: { chapterId: string }) {
  const { data, isLoading, isError } = useUnifiedVideoList(chapterId);

  if (isLoading)
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 })
          .fill(0)
          .flatMap((_, i) => (
            <Skeleton className="h-16 w-full" key={i} />
          ))}
      </div>
    );

  if (isError)
    return <div>Couldn't able to fetch the lesson videos of this chapter</div>;

  if (data.length === 0)
    return (
      <div className="text-muted-foreground px-2.5 text-sm">
        No videos, this chapter won't be available to students until it contains
        videos.
      </div>
    );

  return (
    <div className="w-full space-y-2">
      {data.map((video) => (
        <VideoItem key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoItem({ video }: { video: UnifiedVideo }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { retryUpload, getUpload } = useUploadManager();

  function handleReselectFile(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    const upload = getUpload(video.id);

    if (selectedFile) {
      if (upload?.fileName !== selectedFile.name) {
        toast.error("Invalid file selected", {
          description: "Select same file to continue upload",
        });
        return;
      }
      const endpoint = upload.endpoint;

      if (!endpoint) {
        toast.error("Can't upload the file, remove and reupload");
        return;
      }

      retryUpload(upload.videoId, {
        endpoint,
        file: selectedFile,
      });
    }
  }

  return (
    <div
      className={cn(
        "flex h-16 max-h-16 w-full items-center gap-2.5 rounded-md px-2",
        video.isUploading
          ? "hover:cursor-default"
          : "hover:bg-accent/50 hover:text-accent-foreground hover:cursor-pointer",
      )}
      key={video.id}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        <div className="bg-accent relative aspect-video h-full w-20 overflow-hidden rounded-sm">
          {video.status === "ready" && (
            <Image
              src={`https://image.mux.com/${video.playbackId}/thumbnail.png?width=214&height=121&time=15`}
              fill
              alt={`${video.title}'s thumbneil`}
              className="aspect-video h-full w-full"
            />
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex justify-between">
          <div className="h-full space-y-1.5">
            <span className="truncate text-sm">{video.title}</span>
            {video.status === "ready" && (
              <p className="text-muted-foreground text-xs">
                {video.description ?? "Add description..."}
              </p>
            )}
          </div>
          <span className="text-muted-foreground ml-2 flex-shrink-0 text-xs">
            {/** Local Uploading status */}
            {video.isUploading && !video.interrupted ? (
              <span className="text-accent-foreground">
                {video.uploadStatus === "uploading" &&
                  `Uploading... ${video.uploadProgress}%`}
                {video.uploadStatus === "paused" && "Paused"}
                {video.uploadStatus === "error" && "Failed"}
                {video.uploadStatus === "cancelled" && "Cancelled"}
                {video.uploadStatus === "pending" && "Preparing..."}
              </span>
            ) : (
              <>
                {video.status === "waiting" && `Processing...`}
                {video.status === "asset_created" && "Processing asset..."}
                {video.status === "errored" && "Failed"}
                {video.status === "cancelled" && "Cancelled"}
                {video.status === "ready" && video.isPublished
                  ? "Published"
                  : "Private"}
              </>
            )}
          </span>
        </div>

        {/* Upload Progress Bar and Details */}
        {video.isUploading &&
          !video.uploadError &&
          video.uploadStatus !== "success" && (
            <div className="text-muted-foreground flex gap-1.5 text-xs">
              <span>
                {video.uploadedBytes && video.fileSize ? (
                  <>
                    {formatFileSize(video.uploadedBytes)} /{" "}
                    {formatFileSize(video.fileSize)}
                  </>
                ) : (
                  `${video.uploadProgress ?? 0}%`
                )}
              </span>
              <span>ᐧ</span>
              {video.uploadSpeed && video.uploadSpeed > 0 && (
                <span>{formatUploadSpeed(video.uploadSpeed)}</span>
              )}

              {video.estimatedTimeRemaining &&
                video.estimatedTimeRemaining > 0 && (
                  <span>
                    {formatTimeRemaining(video.estimatedTimeRemaining)}
                  </span>
                )}
            </div>
          )}

        {/* Error Message */}
        {video.uploadError && (
          <div className="text-destructive text-xs">⚠️ {video.uploadError}</div>
        )}
      </div>

      {/** Action */}
      <div className="space-x-1.5">
        {video.interrupted && (
          <>
            <input
              type="file"
              hidden
              accept={`video/*`}
              ref={fileInputRef}
              onChange={(e) => {
                if (fileInputRef.current) {
                  handleReselectFile(e);
                  // Remove the selected file from input
                  fileInputRef.current.value = "";
                }
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              size={"sm"}
              variant={"secondary"}
              className="rounded-full"
            >
              Select
            </Button>
            <Button
              size={"sm"}
              variant={"secondary"}
              className="text-destructive bg-destructive/20 rounded-full"
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
