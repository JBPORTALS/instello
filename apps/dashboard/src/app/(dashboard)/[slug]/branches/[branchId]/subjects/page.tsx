import Container from "@/components/container";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DataTableClient from "./data-table.client";

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  prefetch(trpc.subject.list.queryOptions({ branchId }));

  return (
    <HydrateClient>
      <Container className="px-16">
        <h2 className="text-3xl font-semibold">Subjects</h2>
        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}
