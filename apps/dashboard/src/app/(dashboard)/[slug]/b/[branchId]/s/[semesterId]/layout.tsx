import React from "react";
import { cookies } from "next/headers";
import { SemesterSwitcher } from "@/components/semester-switcher";
import { SiteHeader } from "@/components/site-header";
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
  prefetch(trpc.branch.getByBranchId.queryOptions({ branchId }));
  prefetch(trpc.branch.getSemesterList.queryOptions({ branchId }));

  const cookieStore = await cookies();
  const semesterCookieRaw = cookieStore.get("semester")?.value ?? "null";
  const semesterCookie = JSON.parse(semesterCookieRaw) as Record<
    string,
    string
  >;

  return (
    <HydrateClient>
      <SiteHeader
        startElement={<BranchTabs />}
        endElement={<SemesterSwitcher defaultSemesterCookie={semesterCookie} />}
      />

      {children}
    </HydrateClient>
  );
}
