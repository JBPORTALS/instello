import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";

import "@instello/ui/globals.css";

import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { buttonVariants } from "@instello/ui/components/button";
import { cn } from "@instello/ui/lib/utils";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Instello - One Platform. Every Possibility.",
    template: "%s | Instello",
  },
  description:
    "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease on our unified platform.",
  keywords: [
    "education platform",
    "learning management system",
    "student portal",
    "institution management",
    "online education",
    "educational technology",
    "LMS",
    "ERP for education",
    "student management",
    "institute management",
  ],
  authors: [{ name: "Instello Team" }],
  creator: "Instello",
  publisher: "Instello",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://instello.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://instello.in",
    title: "Instello - One Platform. Every Possibility.",
    description:
      "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease.",
    siteName: "Instello",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Instello - Educational Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instello - One Platform. Every Possibility.",
    description:
      "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease.",
    images: ["/banner.png"],
    creator: "@instello",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
          className={`${montserrat.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
