import * as UpChunk from "@mux/upchunk";

import { useUploadStore } from "./upload-store";

export interface UploadOptions {
  videoId: string;
  file: File;
  endpoint: string;
  onProgress?: (progress: number, uploadedBytes: number) => void;
  onSuccess?: (response: unknown) => void;
  onError?: (error: Error) => void;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
}

export class UploadManager {
  private static instance: UploadManager | undefined;
  private uploads = new Map<string, UpChunk.UpChunk>();
  private store = useUploadStore.getState();

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): UploadManager {
    if (!UploadManager.instance) {
      return new UploadManager();
    }
    UploadManager.instance = new UploadManager();
    return UploadManager.instance;
  }

  /**
   * Start a new upload
   */
  startUpload(options: UploadOptions): void {
    const { videoId, file, endpoint, onProgress, onSuccess, onError } = options;

    // Create upload item in store
    const uploadItem = {
      videoId,
      uploadId: `${videoId}-${Date.now()}`,
      progress: 0,
      status: "pending" as const,
      fileName: file.name,
      fileSize: file.size,
      uploadedBytes: 0,
      startTime: Date.now(),
    };

    this.store.addUpload(uploadItem);

    try {
      // Create UpChunk upload instance
      const upload = UpChunk.createUpload({
        endpoint,
        file,
        chunkSize: 5120, // 5MB chunks
        maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB max
      });

      // Store the upload instance
      this.uploads.set(videoId, upload);

      // Update store with upload instance
      this.store.updateStatus(videoId, "uploading");

      // Set up event listeners
      upload.on("progress", (progress: CustomEvent<number>) => {
        const progressPercent = Math.round(progress.detail);
        const uploadedBytes = Math.round((progress.detail / 100) * file.size);

        this.store.updateProgress(videoId, progressPercent, uploadedBytes);
        onProgress?.(progressPercent, uploadedBytes);
      });

      upload.on("success", (response: CustomEvent<unknown>) => {
        this.store.updateStatus(videoId, "success");
        this.uploads.delete(videoId);
        onSuccess?.(response.detail);
      });

      upload.on("error", (error: CustomEvent<Error>) => {
        this.store.updateStatus(videoId, "error", error.detail.message);
        this.uploads.delete(videoId);
        onError?.(error.detail);
      });

      upload.on(
        "attempt",
        (attempt: CustomEvent<{ attemptNumber: number }>) => {
          console.log(
            `Upload attempt ${attempt.detail.attemptNumber} for ${videoId}`,
          );
        },
      );

      upload.on(
        "chunkSuccess",
        (chunk: CustomEvent<{ chunkNumber: number }>) => {
          console.log(
            `Chunk ${chunk.detail.chunkNumber} uploaded successfully for ${videoId}`,
          );
        },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.store.updateStatus(videoId, "error", errorMessage);
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
    }
  }

  /**
   * Pause an upload
   */
  pauseUpload(videoId: string): boolean {
    const upload = this.uploads.get(videoId);
    if (!upload) {
      console.warn(`No active upload found for videoId: ${videoId}`);
      return false;
    }

    try {
      upload.pause();
      this.store.pauseUpload(videoId);
      return true;
    } catch (error) {
      console.error(`Failed to pause upload for ${videoId}:`, error);
      return false;
    }
  }

  /**
   * Resume a paused upload
   */
  resumeUpload(videoId: string): boolean {
    const upload = this.uploads.get(videoId);
    if (!upload) {
      console.warn(`No active upload found for videoId: ${videoId}`);
      return false;
    }

    try {
      upload.resume();
      this.store.resumeUpload(videoId);
      return true;
    } catch (error) {
      console.error(`Failed to resume upload for ${videoId}:`, error);
      return false;
    }
  }

  /**
   * Cancel an upload
   */
  cancelUpload(videoId: string): boolean {
    const upload = this.uploads.get(videoId);
    if (!upload) {
      console.warn(`No active upload found for videoId: ${videoId}`);
      return false;
    }

    try {
      upload.abort();
      this.store.cancelUpload(videoId);
      this.uploads.delete(videoId);
      return true;
    } catch (error) {
      console.error(`Failed to cancel upload for ${videoId}:`, error);
      return false;
    }
  }

  /**
   * Retry a failed upload
   */
  retryUpload(videoId: string, options: Omit<UploadOptions, "videoId">) {
    const uploadItem = this.store.getUpload(videoId);
    if (!uploadItem) {
      throw new Error(`No upload found for videoId: ${videoId}`);
    }

    // Reset the upload status
    this.store.retryUpload(videoId);

    // Start a new upload with the same options
    this.startUpload({
      ...options,
      videoId,
    });
  }

  /**
   * Get upload status
   */
  getUploadStatus(videoId: string) {
    return this.store.getUpload(videoId);
  }

  /**
   * Get all uploads
   */
  getAllUploads() {
    return this.store.getAllUploads();
  }

  /**
   * Get uploads by status
   */
  getUploadsByStatus(
    status:
      | "pending"
      | "uploading"
      | "paused"
      | "success"
      | "error"
      | "cancelled",
  ) {
    return this.store.getUploadsByStatus(status);
  }

  /**
   * Remove upload from store
   */
  removeUpload(videoId: string): boolean {
    try {
      this.store.removeUpload(videoId);
      this.uploads.delete(videoId);
      return true;
    } catch (error) {
      console.error(`Failed to remove upload for ${videoId}:`, error);
      return false;
    }
  }

  /**
   * Get upload progress
   */
  getUploadProgress(videoId: string): number {
    const upload = this.store.getUpload(videoId);
    return upload?.progress ?? 0;
  }

  /**
   * Check if upload is active
   */
  isUploadActive(videoId: string): boolean {
    return this.uploads.has(videoId);
  }

  /**
   * Get upload speed (bytes per second)
   */
  getUploadSpeed(videoId: string): number {
    const upload = this.store.getUpload(videoId);
    if (!upload?.startTime) return 0;

    const now = upload.endTime ?? Date.now();
    const elapsed = (now - upload.startTime) / 1000; // seconds
    return elapsed > 0 ? upload.uploadedBytes / elapsed : 0;
  }

  /**
   * Get estimated time remaining (seconds)
   */
  getEstimatedTimeRemaining(videoId: string): number {
    const upload = this.store.getUpload(videoId);
    if (!upload || upload.progress === 0 || upload.progress === 100) return 0;

    const speed = this.getUploadSpeed(videoId);
    if (speed === 0) return 0;

    const remainingBytes = upload.fileSize - upload.uploadedBytes;
    return remainingBytes / speed;
  }

  /**
   * Pause all active uploads
   */
  pauseAllUploads(): void {
    const activeUploads = this.store.getUploadsByStatus("uploading");
    activeUploads.forEach((upload) => {
      this.pauseUpload(upload.videoId);
    });
  }

  /**
   * Resume all paused uploads
   */
  resumeAllUploads(): void {
    const pausedUploads = this.store.getUploadsByStatus("paused");
    pausedUploads.forEach((upload) => {
      this.resumeUpload(upload.videoId);
    });
  }

  /**
   * Cancel all uploads
   */
  cancelAllUploads(): void {
    const activeUploads = this.store.getUploadsByStatus("uploading");
    const pausedUploads = this.store.getUploadsByStatus("paused");

    [...activeUploads, ...pausedUploads].forEach((upload) => {
      this.cancelUpload(upload.videoId);
    });
  }
}

// Export singleton instance
export const uploadManager = UploadManager.getInstance();
