import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@instello/ui/components/button";
import {
  ArrowCircleLeftIcon,
  GooglePlayLogoIcon,
} from "@phosphor-icons/react/ssr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ option: "student" | "institute" }>;
}): Promise<Metadata> {
  const { option } = await params;

  if (option === "student") {
    return {
      title: "Student - Download Mobile App",
      description:
        "Download the Instello mobile app to access your classes, resources, and updates from your institute. Continue your educational journey on the go.",
      openGraph: {
        title: "Student - Download Instello Mobile App",
        description:
          "Download the Instello mobile app to access your classes, resources, and updates from your institute. Continue your educational journey on the go.",
        images: ["/banner.png"],
      },
      twitter: {
        title: "Student - Download Instello Mobile App",
        description:
          "Download the Instello mobile app to access your classes, resources, and updates from your institute. Continue your educational journey on the go.",
        images: ["/banner.png"],
      },
    };
  }

  return {
    title: "Institution - ERP Solution Coming Soon",
    description:
      "Our powerful ERP solution for institutions is launching soon. Join our waitlist to be an early partner and transform your educational management.",
    openGraph: {
      title: "Institution - ERP Solution Coming Soon",
      description:
        "Our powerful ERP solution for institutions is launching soon. Join our waitlist to be an early partner and transform your educational management.",
      images: ["/banner.png"],
    },
    twitter: {
      title: "Institution - ERP Solution Coming Soon",
      description:
        "Our powerful ERP solution for institutions is launching soon. Join our waitlist to be an early partner and transform your educational management.",
      images: ["/banner.png"],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ option: "student" | "institute" }>;
}) {
  const { option } = await params;

  function renderOptionView() {
    switch (option) {
      case "student":
        return (
          <>
            <div className="flex flex-col items-center justify-center gap-3.5">
              <Image
                src={"/instello.svg"}
                width={200}
                className="mb-8"
                height={26}
                alt="Instello"
              />
              <h1 className="scroll-m-20 text-balance text-center text-4xl font-extrabold tracking-tight">
                Download the Mobile App
              </h1>
              <p className="text-muted-foreground text-center text-xl sm:max-w-xl">
                Continue your journey on the Instello mobile app. Download now
                and sign in with your account.
              </p>
            </div>
            <Button size={"xl"}>
              <GooglePlayLogoIcon /> Google Play Store
            </Button>
          </>
        );

      case "institute":
        return (
          <>
            <div className="flex flex-col items-center justify-center gap-3.5">
              <Image
                src={"/instello.svg"}
                width={200}
                className="mb-8"
                height={26}
                alt="Instello"
              />
              <h1 className="scroll-m-20 text-balance text-center text-4xl font-extrabold tracking-tight">
                ERP Solution – Coming Soon
              </h1>
              <p className="text-muted-foreground max-w-full text-center text-xl sm:max-w-xl">
                Our powerful ERP for institutions is launching soon. Stay tuned
                for updates, or contact us to be an early partner.
              </p>
            </div>
            <Button size={"xl"} variant={"secondary"}>
              Join Waitlist
            </Button>
          </>
        );

      default:
        notFound();
    }
  }
  return (
    <main className="pattern-polka-v2 flex h-svh w-full flex-col items-center justify-center gap-8 px-4">
      <Button variant={"outline"} asChild className="fixed left-4 top-4">
        <Link href={"/"}>
          <ArrowCircleLeftIcon weight="duotone" /> Back to Home
        </Link>
      </Button>
      {renderOptionView()}
    </main>
  );
}
