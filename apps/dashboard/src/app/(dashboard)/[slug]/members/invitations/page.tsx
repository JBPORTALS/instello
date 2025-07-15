import Container from "@/components/container";
import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { MembersTabs } from "../members-tabs";
import DataTableClient from "./data-table.client";

export default function Page() {
  prefetch(trpc.organization.getInviationList.queryOptions());
  return (
    <HydrateClient>
      <SiteHeader startElement={<MembersTabs />} />
      <Container className="px-16">
        <div className="inline-flex w-full justify-between">
          <h2 className="text-3xl font-semibold">Invitations</h2>
        </div>

        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}
