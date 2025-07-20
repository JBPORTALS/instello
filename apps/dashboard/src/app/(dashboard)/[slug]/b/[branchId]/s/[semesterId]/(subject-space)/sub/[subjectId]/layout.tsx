import React from "react";
import SemesterSwitcherServer from "@/components/semester-switcher/server";
import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { SubjectTabs } from "./subject-tabs";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ branchId: string; subjectId: string }>;
}) {
  const { branchId, subjectId } = await params;
  prefetch(trpc.branch.getByBranchId.queryOptions({ branchId }));
  prefetch(trpc.branch.getSemesterList.queryOptions({ branchId }));
  prefetch(trpc.subject.getBySubjectId.queryOptions({ subjectId, branchId }));

  return (
    <HydrateClient>
      <SiteHeader
        startElement={<SubjectTabs />}
        endElement={<SemesterSwitcherServer />}
      />

      {children}
    </HydrateClient>
  );
}
