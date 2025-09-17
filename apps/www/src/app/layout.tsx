import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";

import "@instello/ui/globals.css";

import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { buttonVariants } from "@instello/ui/components/button";
import { cn } from "@instello/ui/lib/utils";

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
    <ClerkProvider
      appearance={{
        elements: {
          button: buttonVariants(),
          input: cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
        },
        variables: {
          colorBackground: "var(--color-card)",
          borderRadius: "var(--radius-sm)",
          colorDanger: "var(--color-destructive)",
          colorForeground: "var(--color-card-foreground)",
          colorInput: "var(--color-background)",
          colorMuted: "var(--color-muted)",
          colorMutedForeground: "var(--color-muted-foreground)",
          colorInputForeground: "var(--color-foreground)",
          colorPrimary: "var(--color-primary)",
          colorPrimaryForeground: "var(--color-primary-foreground)",
          colorNeutral: "var(--color-accent-foreground)",
          colorRing: "var(--color-ring)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.878rem",
          colorShadow: "rgba(0,0,0,0)",
        },
      }}
    >
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
    </ClerkProvider>
  );
}
