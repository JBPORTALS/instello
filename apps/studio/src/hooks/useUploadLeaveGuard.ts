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
      e.preventDefault();
      e.returnValue = "";
    };

    // On actual page hide (navigation/refresh confirmed), mark as interrupted
    const onPageHide = () => {
      if (!hasActive) return;
      // Only mark as interrupted if the page is actually being hidden
      // (this will not run if the user cancels the confirmation dialog)
      Object.values(uploads).forEach((u) => {
        if (u.status === "uploading") setInterrupted(u.videoId, true);
      });
    };

    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [uploads, setInterrupted]);
}
