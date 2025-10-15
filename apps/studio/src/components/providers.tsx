"use client";

import * as React from "react";
import { useUploadLeaveGuard } from "@/hooks/useUploadLeaveGuard";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@instello/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  useUploadLeaveGuard();
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <TRPCReactProvider>
        {children}
        <Toaster />
      </TRPCReactProvider>
    </NextThemesProvider>
  );
}
