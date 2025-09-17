import React from "react";
import Image from "next/image";
import { Button } from "@instello/ui/components/button";

export function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between px-4 sm:px-8 md:px-10 xl:px-14">
      <Image
        src={"/instello.svg"}
        height={28}
        width={110}
        alt="Instello Logo"
      />

      <div className="space-x-3.5">
        <Button variant={"ghost"}>Sign in</Button>
        <Button variant={"outline"}>Get started</Button>
      </div>
    </header>
  );
}
