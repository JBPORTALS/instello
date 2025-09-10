"use client";

import Image from "next/image";
import {
  formatFileSize,
  formatTimeRemaining,
  formatUploadSpeed,
  useUnifiedVideoList,
} from "@/hooks/useUnifiedVideoList";
import { Skeleton } from "@instello/ui/components/skeleton";

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
      {data.map((item) => (
        <div
          className={`hover:bg-accent/50 hover:text-accent-foreground flex w-full items-center gap-2.5 rounded-md px-2 ${
            item.isUploading ? "min-h-20" : "h-20"
          } ${item.isUploading ? "hover:cursor-default" : "hover:cursor-pointer"}`}
          key={item.id}
        >
          {/* Status Icon */}
          <div className="flex-shrink-0">
            <div className="bg-accent relative aspect-video h-full w-20 overflow-hidden rounded-sm">
              {item.status === "ready" && (
                <Image
                  src={`https://image.mux.com/${item.playbackId}/thumbnail.png?width=214&height=121&time=15`}
                  fill
                  alt={`${item.title}'s thumbneil`}
                  className="aspect-video h-full w-full"
                />
              )}
            </div>
          </div>

          {/* Video Info */}
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex justify-between">
              <div className="h-full space-y-1.5">
                <span className="truncate text-sm">{item.title}</span>
                {item.status === "ready" && (
                  <p className="text-muted-foreground text-xs">
                    {item.description ?? "Add description..."}
                  </p>
                )}
              </div>
              <span className="text-muted-foreground ml-2 flex-shrink-0 text-xs">
                {item.isUploading && item.uploadStatus !== "success" ? (
                  <span className="text-accent-foreground">
                    {item.uploadStatus === "uploading" &&
                      `Uploading... ${item.uploadProgress}%`}
                    {item.uploadStatus === "paused" && "Paused"}
                    {item.uploadStatus === "error" && "Failed"}
                    {item.uploadStatus === "cancelled" && "Cancelled"}
                    {item.uploadStatus === "pending" && "Preparing..."}
                  </span>
                ) : (
                  <>
                    {item.status === "waiting" && `Processing...`}
                    {item.status === "asset_created" && "Processing asset..."}
                    {item.status === "errored" && "Failed"}
                    {item.status === "cancelled" && "Cancelled"}
                    {item.status === "ready" && "Ready to watch"}
                  </>
                )}
              </span>
            </div>

            {/* Upload Progress Bar and Details */}
            {item.isUploading &&
              !item.uploadError &&
              item.uploadStatus !== "success" && (
                <div className="text-muted-foreground flex gap-1.5 text-xs">
                  <span>
                    {item.uploadedBytes && item.fileSize ? (
                      <>
                        {formatFileSize(item.uploadedBytes)} /{" "}
                        {formatFileSize(item.fileSize)}
                      </>
                    ) : (
                      `${item.uploadProgress ?? 0}%`
                    )}
                  </span>
                  <span>ᐧ</span>
                  {item.uploadSpeed && item.uploadSpeed > 0 && (
                    <span>{formatUploadSpeed(item.uploadSpeed)}</span>
                  )}

                  {item.estimatedTimeRemaining &&
                    item.estimatedTimeRemaining > 0 && (
                      <span>
                        {formatTimeRemaining(item.estimatedTimeRemaining)}
                      </span>
                    )}
                </div>
              )}

            {/* Error Message */}
            {item.uploadError && (
              <div className="text-destructive rounded p-1 text-xs">
                {item.uploadError}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
