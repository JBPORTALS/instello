import type * as UpChunk from "@mux/upchunk";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UploadStatus =
  | "pending"
  | "uploading"
  | "paused"
  | "success"
  | "error"
  | "cancelled";

export interface UploadItem {
  videoId: string;
  progress: number;
  status: UploadStatus;
  error?: string;
  upload?: UpChunk.UpChunk;
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  startTime?: number;
  endTime?: number;
  endpoint?: string;
  interrupted?: boolean;
}

interface UploadStore {
  uploads: Record<string, UploadItem>;
  addUpload: (upload: UploadItem) => void;
  updateProgress: (
    videoId: string,
    progress: number,
    uploadedBytes: number,
  ) => void;
  updateStatus: (videoId: string, status: UploadStatus, error?: string) => void;
  setInterrupted: (videoId: string, interrupted: boolean) => void;
  removeUpload: (videoId: string) => void;
  pauseUpload: (videoId: string) => void;
  resumeUpload: (videoId: string) => void;
  cancelUpload: (videoId: string) => void;
  retryUpload: (videoId: string) => void;
  getUpload: (videoId: string) => UploadItem | undefined;
  getAllUploads: () => UploadItem[];
  getUploadsByStatus: (status: UploadStatus) => UploadItem[];
}

export const useUploadStore = create(
  persist<UploadStore>(
    (set, get) => ({
      uploads: {},

      addUpload: (upload) =>
        set((state) => ({
          uploads: { ...state.uploads, [upload.videoId]: upload },
        })),

      updateProgress: (videoId, progress, uploadedBytes) =>
        set((state) => {
          const upload = state.uploads[videoId];
          if (!upload) return state;

          return {
            uploads: {
              ...state.uploads,
              [videoId]: {
                ...upload,
                progress,
                uploadedBytes,
                status: upload.status === "paused" ? "paused" : "uploading",
              },
            },
          };
        }),

      updateStatus: (videoId, status, error) =>
        set((state) => {
          const upload = state.uploads[videoId];
          if (!upload) return state;

          const now = Date.now();
          const updates: Partial<UploadItem> = { status };

          if (error) updates.error = error;

          if (
            status === "success" ||
            status === "error" ||
            status === "cancelled"
          ) {
            updates.endTime = now;
          }

          return {
            uploads: {
              ...state.uploads,
              [videoId]: { ...upload, ...updates },
            },
          };
        }),

      setInterrupted: (videoId, interrupted) =>
        set((state) => {
          const upload = state.uploads[videoId];
          if (!upload) return state;
          return {
            uploads: {
              ...state.uploads,
              [videoId]: {
                ...upload,
                interrupted,
                error: interrupted
                  ? "Uploading has been interupted select same file to continue."
                  : undefined,
              },
            },
          };
        }),

      removeUpload: (videoId) =>
        set((state) => {
          const { [videoId]: _removed, ...remaining } = state.uploads;
          return { uploads: remaining };
        }),

      pauseUpload: (videoId) =>
        set((state) => {
          const upload = state.uploads[videoId];
          if (!upload?.upload) return state;

          upload.upload.pause();
          return {
            uploads: {
              ...state.uploads,
              [videoId]: { ...upload, status: "paused" },
            },
          };
        }),

      resumeUpload: (videoId) =>
        set((state) => {
          const upload = state.uploads[videoId];
          if (!upload?.upload) return state;

          upload.upload.resume();
          return {
            uploads: {
              ...state.uploads,
              [videoId]: { ...upload, status: "uploading" },
            },
          };
        }),

      cancelUpload: (videoId) =>
        set((state) => {
          const upload = state.uploads[videoId];
          if (!upload?.upload) return state;

          upload.upload.abort();
          return {
            uploads: {
              ...state.uploads,
              [videoId]: { ...upload, status: "cancelled" },
            },
          };
        }),

      retryUpload: (videoId) =>
        set((state) => {
          const upload = state.uploads[videoId];
          if (!upload) return state;

          return {
            uploads: {
              ...state.uploads,
              [videoId]: {
                ...upload,
                interrupted: false,
                status: "pending",
                progress: 0,
                uploadedBytes: 0,
                error: undefined,
                startTime: Date.now(),
                endTime: undefined,
              },
            },
          };
        }),

      getUpload: (videoId) => get().uploads[videoId],

      getAllUploads: () => Object.values(get().uploads),

      getUploadsByStatus: (status) =>
        Object.values(get().uploads).filter(
          (upload) => upload.status === status,
        ),
    }),
    {
      name: "studio.uploads",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        uploads: Object.fromEntries(
          Object.entries(state.uploads).map(([key, value]) => [
            key,
            { ...value, upload: undefined },
          ]),
        ),
      }),
      version: 1,
    },
  ),
);
