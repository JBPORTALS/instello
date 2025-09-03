"use client";

import * as React from "react";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@instello/ui/components/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <TRPCReactProvider>
        {children}
        <Toaster />
      </TRPCReactProvider>
    </NextThemesProvider>
  );
}
