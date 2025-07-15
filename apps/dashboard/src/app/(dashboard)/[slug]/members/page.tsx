import React from "react";
import Container from "@/components/container";
import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";

import DataTableClient from "./data-table.client";

export default function Page() {
  prefetch(trpc.organization.getOrganizationMembers.queryOptions());
  return (
    <HydrateClient>
      <SiteHeader title="Members" />
      <Container className="px-16">
        <div className="inline-flex w-full justify-between">
          <h2 className="text-3xl font-semibold">Members</h2>
          <Button>Invite members</Button>
        </div>

        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}
