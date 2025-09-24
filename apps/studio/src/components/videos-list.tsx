"use client";

import type { UnifiedVideo } from "@/hooks/useUnifiedVideoList";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  formatFileSize,
  formatTimeRemaining,
  formatUploadSpeed,
  useUnifiedVideoList,
} from "@/hooks/useUnifiedVideoList";
import { useUploadManager } from "@/hooks/useUploadManager";
import { Button } from "@instello/ui/components/button";
import { Progress } from "@instello/ui/components/progress";
import { Skeleton } from "@instello/ui/components/skeleton";
import { cn } from "@instello/ui/lib/utils";
import {
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
  PenNibIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import { ChangeVisibilityVideoDropdown } from "./change-visibility-video-dropdown";
import { DeleteVideoDialog } from "./dialogs/delete-video-dialog";

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
        No videos, this chapter won't be able to publish until it contains
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
  const router = useRouter();
  const { channelId } = useParams<{ channelId: string }>();

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
        "group relative flex h-16 max-h-16 w-full items-center gap-2.5 overflow-hidden rounded-md px-2",
        video.isUploading
          ? "bg-transparent"
          : "hover:bg-accent/25 hover:text-accent-foreground",
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
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex justify-between">
          <div className="flex h-full flex-col gap-1.5">
            <span className="max-w-xl truncate text-sm">{video.title}</span>
            {video.status === "ready" && (
              <p className="text-muted-foreground max-w-xl truncate text-xs">
                {video.description ?? "Add description..."}
              </p>
            )}
          </div>
          <span className="text-muted-foreground ml-2 inline-flex flex-shrink-0 items-center gap-0.5 text-xs">
            {/** Local Uploading status */}
            {video.isUploading && !video.interrupted ? (
              <span className="text-accent-foreground">
                {video.uploadStatus === "uploading" && (
                  <div className="flex items-center gap-1.5">
                    <Progress
                      className="h-1.5 min-w-32"
                      value={video.uploadProgress}
                    />
                    <span className="min-w-fit">{video.uploadProgress}%</span>
                  </div>
                )}
                {video.uploadStatus === "paused" && "Paused"}
                {video.uploadStatus === "error" && "Failed"}
                {video.uploadStatus === "cancelled" && "Cancelled"}
                {video.uploadStatus === "pending" && "Preparing..."}
              </span>
            ) : !video.isUploading && !video.interrupted ? (
              <>
                {video.status === "waiting" && `Processing...`}
                {video.status === "asset_created" && "Processing asset..."}
                {video.status === "errored" && "Failed"}
                {video.status === "cancelled" && "Cancelled"}
                {video.status === "ready" &&
                  (video.isPublished ? (
                    <>
                      <GlobeHemisphereEastIcon weight="duotone" /> Public
                    </>
                  ) : (
                    <>
                      <LockLaminatedIcon weight="duotone" /> Private
                    </>
                  ))}
              </>
            ) : null}
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
              <span>ᐧ</span>
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

        {video.status == "ready" && (
          <div className="from-accent/50 to-accent/0 absolute bottom-0 right-0 top-0 flex h-16 items-center gap-1.5 bg-gradient-to-l px-2 opacity-0 group-hover:opacity-100 has-[button[data-loading=true]]:opacity-100 has-[button[data-state=open]]:opacity-100">
            <ChangeVisibilityVideoDropdown videoId={video.id} />
            <Button
              onClick={() => router.push(`/c/${channelId}/v/${video.id}`)}
              size={"sm"}
              variant={"secondary"}
              className="rounded-full"
            >
              <PenNibIcon weight="duotone" />
              Edit
            </Button>
            <DeleteVideoDialog videoId={video.id} chapterId={video.chapterId}>
              <Button
                size={"sm"}
                variant={"secondary"}
                className="text-destructive rounded-full"
              >
                <TrashIcon weight="duotone" />
                Delete
              </Button>
            </DeleteVideoDialog>
          </div>
        )}
      </div>
    </div>
  );
}
