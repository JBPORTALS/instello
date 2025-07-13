import React from "react";
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
  return (
    <HydrateClient>
      <SiteHeader startElement={<BranchTabs />} />
      <section className="relative aspect-video h-52 bg-gradient-to-r from-blue-800 to-indigo-900"></section>
      {children}
    </HydrateClient>
  );
}
