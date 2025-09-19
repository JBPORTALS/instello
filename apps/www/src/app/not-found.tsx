import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@instello/ui/components/button";
import { ArrowRightIcon, HouseIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Return to Instello's homepage to continue your educational journey.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="pattern-polka-v2 flex h-svh w-full flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="bg-accent/50 shadow-accent-foreground/50 flex size-24 items-center justify-center rounded-3xl shadow-2xl backdrop-blur-2xl dark:border">
          <Image
            src={"/instello-feather.svg"}
            alt="Instello Feather Logo"
            height={60}
            width={60}
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-muted-foreground text-6xl font-bold">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md text-lg">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-fit sm:flex-row">
          <Button asChild size="lg" className="w-full rounded-full sm:w-fit">
            <Link href="/">
              <HouseIcon weight="duotone" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full rounded-full sm:w-fit"
          >
            <Link href="/get-started">
              Get Started
              <ArrowRightIcon weight="duotone" />
            </Link>
          </Button>
        </div>
      </div>

      <footer className="text-muted-foreground text-sm">
        <span>© 2025 Instello. All rights reserved.</span>
      </footer>
    </div>
  );
}
