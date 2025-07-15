"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { SpinnerGapIcon } from "@phosphor-icons/react";

export default function Page() {
  const { organization: activeOrganization } = useOrganization();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: true,
  });

  const router = useRouter();
  React.useEffect(() => {
    if (activeOrganization) router.replace(`/${activeOrganization.slug}`);
    else {
      const firstOrganization = userMemberships.data?.at(0);
      if (firstOrganization) {
        setActive?.({
          organization: firstOrganization.organization,
        })
          .then()
          .catch(() => console.log("Unable to set active organization"));
      }
    }
  }, [activeOrganization, router, setActive, userMemberships.data]);

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <SpinnerGapIcon
        className="text-muted-foreground size-8 animate-spin"
        weight={"thin"}
      />
    </div>
  );
}
