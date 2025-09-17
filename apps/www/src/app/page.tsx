import Image from "next/image";
import { Button } from "@instello/ui/components/button";
import { ArrowRightIcon, PlayCircleIcon } from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <div className="bg-accent/30 pattern-polka-v2 rounded-4xl flex h-full flex-col items-center justify-center gap-6 border px-10 sm:gap-10">
      <div className="bg-accent/50 shadow-accent-foreground/50 mb-8 flex size-28 items-center justify-center rounded-3xl shadow-2xl backdrop-blur-2xl sm:size-32 dark:border">
        <Image
          src={"/instello-feather.svg"}
          alt="Instello Fetaher"
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
        <Button size={"xl"} className="rounded-full shadow-sm">
          Get started <ArrowRightIcon weight="duotone" />
        </Button>
      </div>
      <footer className="h-16">
        <span className="text-muted-foreground text-sm">
          © 2025 Instello. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
