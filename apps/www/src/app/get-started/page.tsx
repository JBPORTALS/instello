import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@instello/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@instello/ui/components/card";
import {
  ArrowCircleLeftIcon,
  BuildingApartmentIcon,
  StudentIcon,
} from "@phosphor-icons/react/ssr";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Choose your role to get started with Instello. Whether you're a student looking to access your classes or an institution wanting to manage your educational programs, we have the right solution for you.",
  openGraph: {
    title: "Get Started with Instello",
    description:
      "Choose your role to get started with Instello. Whether you're a student looking to access your classes or an institution wanting to manage your educational programs, we have the right solution for you.",
    images: ["/banner.png"],
  },
  twitter: {
    title: "Get Started with Instello",
    description:
      "Choose your role to get started with Instello. Whether you're a student looking to access your classes or an institution wanting to manage your educational programs, we have the right solution for you.",
    images: ["/banner.png"],
  },
};

export default function Page() {
  return (
    <main className="pattern-polka-v2 flex h-svh w-full flex-col items-center justify-center gap-16 px-4">
      <Button variant={"outline"} asChild className="fixed left-4 top-4">
        <Link href={"/"}>
          <ArrowCircleLeftIcon weight="duotone" /> Back to Home
        </Link>
      </Button>
      <div className="flex flex-col items-center justify-center gap-3.5">
        <Image
          src={"/instello.svg"}
          width={200}
          className="mb-8"
          height={26}
          alt="Instello"
        />
        <h1 className="scroll-m-20 text-balance text-center text-4xl font-extrabold tracking-tight">
          Choose Your Role
        </h1>
        <p className="text-muted-foreground text-center text-xl">
          Select your role to continue. This helps us personalize your
          experience.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 lg:flex-row">
        <Link href={`/get-started/student`}>
          <Card className="min-w-md hover:bg-accent hover:border-primary transition-all duration-200">
            <CardContent>
              <StudentIcon
                className="text-muted-foreground size-16"
                weight="duotone"
              />
            </CardContent>
            <CardHeader>
              <CardTitle>I am a student</CardTitle>
              <CardDescription>
                Access classes, resources, and updates from your institute.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/get-started/institute`}>
          <Card className="min-w-md hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all duration-200">
            <CardContent>
              <BuildingApartmentIcon
                className="text-muted-foreground size-16"
                weight="duotone"
              />
            </CardContent>
            <CardHeader>
              <CardTitle>I represent an Institution</CardTitle>
              <CardDescription>
                Set up your institute, invite staff, and onboard students.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
