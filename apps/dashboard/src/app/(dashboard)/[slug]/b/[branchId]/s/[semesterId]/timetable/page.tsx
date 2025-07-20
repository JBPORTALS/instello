import Link from "next/link";
import Container from "@/components/container";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Protect } from "@clerk/nextjs";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/ssr";

import { TimetableClient } from "./timetable.client";

export default async function Page({
  params,
}: {
  params: Promise<{ branchId: string; slug: string; semesterId: string }>;
}) {
  const { branchId, slug, semesterId } = await params;
  prefetch(trpc.timetable.findByActiveSemester.queryOptions({ branchId }));

  return (
    <HydrateClient>
      <Container className="px-16">
        <div className="inline-flex w-full justify-between">
          <h2 className="text-3xl font-semibold">Timetable</h2>
          <Protect permission={"org:timetables:create"}>
            <Button asChild>
              <Link
                href={`/${slug}/b/${branchId}/s/${semesterId}/timetable/new`}
              >
                <PlusIcon />
                New
              </Link>
            </Button>
          </Protect>
        </div>

        <TimetableClient />
      </Container>
    </HydrateClient>
  );
}
