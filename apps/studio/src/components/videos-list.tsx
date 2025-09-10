"use client";

import {
  formatFileSize,
  formatTimeRemaining,
  formatUploadSpeed,
  useUnifiedVideoList,
} from "@/hooks/useUnifiedVideoList";
import { uploadManager } from "@/store/UploadManager";
import { Skeleton } from "@instello/ui/components/skeleton";
import {
  CheckCircleIcon,
  ExclamationMarkIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@phosphor-icons/react";

export function VideosList({ chapterId }: { chapterId: string }) {
  const { data, isLoading, isError } = useUnifiedVideoList(chapterId);

  if (isLoading)
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 })
          .fill(0)
          .flatMap((_, i) => (
            <Skeleton className="h-9 w-full" key={i} />
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
          className={`bg-accent/60 hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-1.5 rounded-md border px-2 ${
            item.isUploading ? "min-h-16" : "h-9"
          } ${item.isUploading ? "hover:cursor-default" : "hover:cursor-pointer"}`}
          key={item.id}
        >
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {item.isUploading ? (
              item.uploadStatus === "uploading" ? (
                <PlayCircleIcon
                  className="size-5 text-blue-500"
                  weight="fill"
                />
              ) : item.uploadStatus === "paused" ? (
                <PauseCircleIcon
                  className="size-5 text-yellow-500"
                  weight="fill"
                />
              ) : item.uploadStatus === "error" ? (
                <ExclamationMarkIcon
                  className="size-5 text-red-500"
                  weight="fill"
                />
              ) : item.uploadStatus === "success" ? (
                <CheckCircleIcon
                  className="size-5 text-green-500"
                  weight="fill"
                />
              ) : (
                <PlayCircleIcon
                  className="size-5 text-gray-500"
                  weight="duotone"
                />
              )
            ) : (
              <PlayCircleIcon className="size-5" weight="duotone" />
            )}
          </div>

          {/* Video Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-semibold">
                {item.title}
              </span>
              <span className="text-muted-foreground ml-2 flex-shrink-0 text-xs">
                {item.isUploading ? (
                  <span className="text-blue-600">
                    {item.uploadStatus === "uploading" &&
                      `Uploading... ${item.uploadProgress}%`}
                    {item.uploadStatus === "paused" && "Paused"}
                    {item.uploadStatus === "error" && "Failed"}
                    {item.uploadStatus === "success" && "Upload Complete"}
                    {item.uploadStatus === "cancelled" && "Cancelled"}
                    {item.uploadStatus === "pending" && "Preparing..."}
                  </span>
                ) : (
                  <>
                    {item.status === "waiting" &&
                      `Uploading... ${item.progress}%`}
                    {item.status === "asset_created" && "Processing asset..."}
                    {item.status === "errored" && "Failed"}
                    {item.status === "cancelled" && "Cancelled"}
                    {item.status === "ready" && "Ready to watch"}
                  </>
                )}
              </span>
            </div>

            {/* Upload Progress Bar and Details */}
            {item.isUploading && (
              <div className="mt-1 space-y-1">
                {/* Progress Bar */}
                <div className="bg-muted h-1.5 w-full rounded-full">
                  <div
                    className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${item.uploadProgress ?? 0}%` }}
                  />
                </div>

                {/* Upload Details */}
                <div className="text-muted-foreground flex justify-between text-xs">
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

                {/* Error Message */}
                {item.uploadError && (
                  <div className="rounded bg-red-50 p-1 text-xs text-red-600">
                    {item.uploadError}
                  </div>
                )}

                {/* Upload Controls */}
                {item.uploadStatus === "uploading" && (
                  <div className="mt-1 flex gap-1">
                    <button
                      onClick={() => uploadManager.pauseUpload(item.id)}
                      className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 hover:bg-yellow-200"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => uploadManager.cancelUpload(item.id)}
                      className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800 hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {item.uploadStatus === "paused" && (
                  <div className="mt-1 flex gap-1">
                    <button
                      onClick={() => uploadManager.resumeUpload(item.id)}
                      className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 hover:bg-green-200"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => uploadManager.cancelUpload(item.id)}
                      className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800 hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {item.uploadStatus === "error" && (
                  <div className="mt-1 flex gap-1">
                    <button
                      onClick={() => {
                        // Note: This would need the original file and endpoint to retry
                        console.log("Retry upload for", item.id);
                      }}
                      className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 hover:bg-blue-200"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => uploadManager.removeUpload(item.id)}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800 hover:bg-gray-200"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
