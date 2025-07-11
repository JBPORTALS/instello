"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { SpinnerGapIcon } from "@phosphor-icons/react";

export default function Page() {
  const { organization: activeOrganization } = useOrganization();

  const router = useRouter();
  React.useEffect(() => {
    if (activeOrganization) router.replace(`/${activeOrganization.slug}`);
  }, [activeOrganization]);

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <SpinnerGapIcon
        className="text-muted-foreground size-8 animate-spin"
        weight={"thin"}
      />
    </div>
  );
}
