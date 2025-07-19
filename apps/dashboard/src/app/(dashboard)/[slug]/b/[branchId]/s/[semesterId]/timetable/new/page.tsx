import Container from "@/components/container";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";
import { Input } from "@instello/ui/components/input";

import { TimetableClient } from "./edit-timetable.client";

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
        <div className="inline-flex w-full justify-between">
          <h2 className="text-3xl font-semibold">New Schedule</h2>

          <div className="inline-flex gap-3.5">
            <Input className="min-w-lg" placeholder="Comiit message..." />
            <Button>Publish</Button>
          </div>
        </div>

        <TimetableClient />
      </Container>
    </HydrateClient>
  );
}
