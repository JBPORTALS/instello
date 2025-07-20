import Container from "@/components/container";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { TimetableClient } from "./timetable.client";

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  prefetch(trpc.timetable.findByActiveSemester.queryOptions({ branchId }));

  return (
    <HydrateClient>
      <Container className="px-16">
        <TimetableClient />
      </Container>
    </HydrateClient>
  );
}
