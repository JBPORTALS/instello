import type { UploadOptions } from "@/store/UploadManager";
import { useUploadStore } from "@/store/upload-store";
import { uploadManager } from "@/store/UploadManager";

/**
 * Hook for managing uploads with Zustand state integration
 */
export function useUploadManager() {
  const store = useUploadStore();

  return {
    // Upload management
    startUpload: (options: UploadOptions) => uploadManager.startUpload(options),
    pauseUpload: (videoId: string) => uploadManager.pauseUpload(videoId),
    resumeUpload: (videoId: string) => uploadManager.resumeUpload(videoId),
    cancelUpload: (videoId: string) => uploadManager.cancelUpload(videoId),
    retryUpload: (videoId: string, options: Omit<UploadOptions, "videoId">) =>
      uploadManager.retryUpload(videoId, options),
    removeUpload: (videoId: string) => uploadManager.removeUpload(videoId),

    // Upload information
    getUpload: (videoId: string) => uploadManager.getUploadStatus(videoId),
    getAllUploads: () => uploadManager.getAllUploads(),
    getUploadsByStatus: (
      status: Parameters<typeof uploadManager.getUploadsByStatus>[0],
    ) => uploadManager.getUploadsByStatus(status),
    getUploadProgress: (videoId: string) =>
      uploadManager.getUploadProgress(videoId),
    isUploadActive: (videoId: string) => uploadManager.isUploadActive(videoId),
    getUploadSpeed: (videoId: string) => uploadManager.getUploadSpeed(videoId),
    getEstimatedTimeRemaining: (videoId: string) =>
      uploadManager.getEstimatedTimeRemaining(videoId),

    // Bulk operations
    pauseAllUploads: () => uploadManager.pauseAllUploads(),
    resumeAllUploads: () => uploadManager.resumeAllUploads(),
    cancelAllUploads: () => uploadManager.cancelAllUploads(),

    // Zustand state
    uploads: store.uploads,
  };
}
