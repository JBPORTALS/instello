import React from "react";
import Container from "@/components/container";
import { InviteMemberButton } from "@/components/invite-member.button";
import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DataTableClient from "./data-table.client";
import { MembersTabs } from "./members-tabs";

export default function Page() {
  prefetch(trpc.erp.organization.getOrganizationMembers.queryOptions());
  return (
    <HydrateClient>
      <SiteHeader startElement={<MembersTabs />} />
      <Container className="px-16">
        <div className="inline-flex w-full justify-between">
          <h2 className="text-3xl font-semibold">Members</h2>
          <InviteMemberButton />
        </div>

        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}
