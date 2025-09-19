import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@instello/ui/components/button";
import { ArrowRightIcon, PlayCircleIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease on our unified platform.",
  openGraph: {
    title: "Instello - One Platform. Every Possibility.",
    description:
      "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease.",
    images: ["/banner.jpg"],
  },
  twitter: {
    title: "Instello - One Platform. Every Possibility.",
    description:
      "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease.",
    images: ["/banner.jpg"],
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Instello",
    description:
      "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease on our unified platform.",
    url: "https://instello.com",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, Mobile",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Instello",
    },
    featureList: [
      "Student Portal",
      "Institution Management",
      "Learning Management System",
      "Educational ERP",
      "Mobile App",
      "Online Education Platform",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="bg-accent/30 pattern-polka-v2 rounded-4xl flex h-full flex-col items-center justify-center gap-6 border px-10 sm:gap-10">
        <div className="bg-accent/50 shadow-accent-foreground/50 mb-8 flex size-28 items-center justify-center rounded-3xl shadow-2xl backdrop-blur-2xl sm:size-32 dark:border">
          <Image
            src={"/instello-feather.svg"}
            alt="Instello Feather Logo"
            height={100}
            width={100}
          />
        </div>
        <h1 className="text-center text-4xl sm:text-6xl">
          One Platform. Every Possibility.
        </h1>
        <h3 className="text-muted-foreground text-center text-base sm:text-xl">
          Learn anywhere. Teach better. Manage with ease.
        </h3>
        <div className="flex w-full flex-col gap-3.5 sm:w-fit sm:flex-row">
          <Button
            size={"xl"}
            variant={"secondary"}
            className="rounded-full shadow-sm"
          >
            Watch demo <PlayCircleIcon weight="duotone" />
          </Button>
          <Button asChild size={"xl"} className="rounded-full shadow-sm">
            <Link href={"/get-started"}>
              Get started <ArrowRightIcon weight="duotone" />
            </Link>
          </Button>
        </div>
        <footer className="h-16">
          <span className="text-muted-foreground text-sm">
            © 2025 Instello. All rights reserved.
          </span>
        </footer>
      </div>
    </>
  );
}
