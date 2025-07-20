import { notFound } from "next/navigation";
import Container from "@/components/container";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";

import { TimetableClient } from "./edit-timetable.client";

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { has } = await auth();

  if (
    !has({ permission: "org:timetables:create" }) &&
    !has({ permission: "org:timetables:update" })
  )
    notFound();

  prefetch(trpc.timetable.findByActiveSemester.queryOptions({ branchId }));

  return (
    <HydrateClient>
      <Container className="px-16">
        <TimetableClient />
      </Container>
    </HydrateClient>
  );
}
