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

  const semesters = Array.from(
    { length: branch.totalSemesters },
    (_, i) => i + 1,
  ).filter((n) =>
    branch.currentSemesterMode == "odd" ? n % 2 === 1 : n % 2 === 0,
  );

  console.log(branchCookie);

  return (
    <HydrateClient>
      <BranchProvider
        currentSemesterMode={branch.currentSemesterMode}
        branchId={branchId}
        defaultBranchCookie={branchCookie}
      >
        <SiteHeader
          startElement={<BranchTabs />}
          endElement={<SemesterSwitcher semesters={semesters} />}
        />

        {children}
      </BranchProvider>
    </HydrateClient>
  );
}
