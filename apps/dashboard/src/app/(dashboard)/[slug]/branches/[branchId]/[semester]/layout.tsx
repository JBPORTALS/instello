import React from "react";
import { SemesterSwitcher } from "@/components/semester-switcher";
import { SiteHeader } from "@/components/site-header";
import { getBranch, getBranchCookie } from "@/context/branch";
import { BranchProvider } from "@/context/branch/client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { BranchTabs } from "./branch-tabs";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const branchCookie = await getBranchCookie();
  const branch = await getBranch({ branchId });
  prefetch(trpc.branch.getByBranchId.queryOptions({ branchId }));

  return (
    <HydrateClient>
      <BranchProvider
        currentSemesterMode={branch.currentSemesterMode}
        branchId={branchId}
        defaultBranchCookie={branchCookie}
      >
        <SiteHeader
          startElement={<BranchTabs />}
          endElement={<SemesterSwitcher semesters={branch.semesters} />}
        />

        {children}
      </BranchProvider>
    </HydrateClient>
  );
}
