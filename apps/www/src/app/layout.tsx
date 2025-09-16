import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";

import "@instello/ui/globals.css";

import { Header } from "@/components/header";
import { Providers } from "@/components/providers";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Instello",
  description: "One Platform. Every Possibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <Header />
          <main className="@container/main h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] px-4 py-4 sm:px-8 md:px-10 xl:px-14">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
