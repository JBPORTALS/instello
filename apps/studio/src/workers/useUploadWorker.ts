"use client";

import { useEffect, useRef } from "react";

export function useUploadWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create the worker on mount
    workerRef.current = new Worker("/workers/upload-worker.js");

    return () => {
      // Kill worker on unmount
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const startUpload = (id: string, url: string, file: File) => {
    workerRef.current?.postMessage({
      type: "START_UPLOAD",
      payload: { id, url, file },
    });
  };

  const pauseUpload = (id: string) => {
    workerRef.current?.postMessage({
      type: "PAUSE_UPLOAD",
      payload: { id },
    });
  };

  const resumeUpload = (id: string) => {
    workerRef.current?.postMessage({
      type: "RESUME_UPLOAD",
      payload: { id },
    });
  };

  const cancelUpload = (id: string) => {
    workerRef.current?.postMessage({
      type: "CANCEL_UPLOAD",
      payload: { id },
    });
  };

  const onMessage = (callback: (event: MessageEvent) => void) => {
    workerRef.current?.addEventListener("message", callback);
  };

  return { startUpload, pauseUpload, resumeUpload, cancelUpload, onMessage };
}
