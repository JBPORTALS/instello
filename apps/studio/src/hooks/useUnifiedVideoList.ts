"use client";

import type { RouterOutputs } from "@instello/api";
import { useMemo } from "react";
import { useUploadStore } from "@/store/upload-store";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

// Type for database video
type DatabaseVideo = RouterOutputs["lms"]["video"]["list"][number];

// Type for upload video (from Zustand store)
interface UploadVideo {
  videoId: string;
  progress: number;
  status:
    | "pending"
    | "uploading"
    | "paused"
    | "success"
    | "error"
    | "cancelled";
  error?: string;
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  startTime?: number;
  endTime?: number;
}

// Unified video type that combines both
export type UnifiedVideo = DatabaseVideo & {
  // Upload-specific properties (only present when uploading)
  isUploading?: boolean;
  uploadProgress?: number;
  uploadStatus?: UploadVideo["status"];
  uploadError?: string;
  fileName?: string;
  fileSize?: number;
  uploadedBytes?: number;
  uploadStartTime?: number;
  uploadEndTime?: number;
  uploadSpeed?: number;
  estimatedTimeRemaining?: number;
};

export function useUnifiedVideoList(chapterId: string) {
  const trpc = useTRPC();
  const { uploads } = useUploadStore();

  // Get database videos
  const dbQuery = useQuery(
    trpc.lms.video.list.queryOptions(
      { chapterId },
      {
        refetchInterval: (q) => {
          // Keep polling if any video is still processing or if there are active uploads
          const hasProcessingVideos = q.state.data?.some(
            (v) => v.status === "asset_created",
          );
          const hasActiveUploads = Object.values(uploads).some(
            (upload) => upload.status === "success",
          );
          return hasProcessingVideos || hasActiveUploads ? 3000 : false;
        },
      },
    ),
  );

  // Merge database videos with upload videos
  const unifiedVideos = useMemo(() => {
    const dbVideos = dbQuery.data ?? [];
    const uploadVideos = Object.values(uploads);

    console.log("uploadVideos", uploadVideos, dbVideos);

    // Create a map of upload videos by videoId for quick lookup
    const uploadMap = new Map<string, UploadVideo>();

    uploadVideos.forEach((upload) => {
      uploadMap.set(upload.videoId, upload);
    });

    // Merge database videos with upload data
    const mergedVideos: UnifiedVideo[] = dbVideos.map((dbVideo) => {
      const uploadData = uploadMap.get(dbVideo.id);

      if (uploadData) {
        // Calculate upload speed and estimated time remaining
        const uploadSpeed = calculateUploadSpeed(uploadData);
        const estimatedTimeRemaining = calculateEstimatedTimeRemaining(
          uploadData,
          uploadSpeed,
        );

        return {
          ...dbVideo,
          isUploading: true,
          uploadProgress: uploadData.progress,
          uploadStatus: uploadData.status,
          uploadError: uploadData.error,
          fileName: uploadData.fileName,
          fileSize: uploadData.fileSize,
          uploadedBytes: uploadData.uploadedBytes,
          uploadStartTime: uploadData.startTime,
          uploadEndTime: uploadData.endTime,
          uploadSpeed,
          estimatedTimeRemaining,
        } as UnifiedVideo;
      }

      return {
        ...dbVideo,
        isUploading: false,
      } as UnifiedVideo;
    });

    return mergedVideos.sort((a, b) => {
      // Sort by upload status first, then by creation time
      if (a.isUploading && !b.isUploading) return -1;
      if (!a.isUploading && b.isUploading) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [dbQuery.data, uploads]);

  return {
    data: unifiedVideos,
    isLoading: dbQuery.isLoading,
    isError: dbQuery.isError,
    refetch: dbQuery.refetch,
  };
}

// Helper function to calculate upload speed (bytes per second)
function calculateUploadSpeed(upload: UploadVideo): number {
  if (!upload.startTime) return 0;

  const now = upload.endTime ?? Date.now();
  const elapsed = (now - upload.startTime) / 1000; // seconds
  return elapsed > 0 ? upload.uploadedBytes / elapsed : 0;
}

// Helper function to calculate estimated time remaining (seconds)
function calculateEstimatedTimeRemaining(
  upload: UploadVideo,
  speed: number,
): number {
  if (upload.progress === 0 || upload.progress === 100 || speed === 0) return 0;

  const remainingBytes = upload.fileSize - upload.uploadedBytes;
  return remainingBytes / speed;
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i] ?? "B"}`;
}

// Helper function to format upload speed
export function formatUploadSpeed(bytesPerSecond: number): string {
  return `${formatFileSize(bytesPerSecond)}/s`;
}

// Helper function to format time remaining
export function formatTimeRemaining(seconds: number): string {
  if (seconds === 0 || !isFinite(seconds)) return "";

  if (seconds < 60) {
    return `${Math.round(seconds)}s remaining`;
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes}m remaining`;
  } else {
    const hours = Math.round(seconds / 3600);
    return `${hours}h remaining`;
  }
}
