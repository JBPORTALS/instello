"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Spinner } from "@instello/ui/components/spinner";

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
    <div className="flex h-svh w-full flex-col items-center justify-center gap-4">
      <h4 className="text-muted-foreground text-lg font-medium">
        Setting up workspace...
      </h4>
      <Spinner
        className="text-muted-foreground size-8 animate-spin"
        weight={"thin"}
      />
    </div>
  );
}
