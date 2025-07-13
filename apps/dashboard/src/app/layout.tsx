import { Geist_Mono, Outfit } from "next/font/google";

import "@instello/ui/globals.css";

import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Instello - Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
