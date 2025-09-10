"use client";

import { useEffect } from "react";
import { useUploadStore } from "@/store/upload-store";

export function useUploadLeaveGuard() {
  const uploads = useUploadStore((s) => s.uploads);
  const setInterrupted = useUploadStore((s) => s.setInterrupted);

  // Persistence now handled by Zustand persist middleware

  // Warn on leave if any upload is active
  useEffect(() => {
    const hasActive = Object.values(uploads).some(
      (u) => u.status === "uploading",
    );

    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasActive) return;
      Object.values(uploads).forEach((u) => {
        if (u.status === "uploading") setInterrupted(u.videoId, true);
      });
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [uploads, setInterrupted]);
}
