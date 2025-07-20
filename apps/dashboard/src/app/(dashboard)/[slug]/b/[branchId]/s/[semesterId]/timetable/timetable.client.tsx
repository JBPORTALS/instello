"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactTimetable } from "@/components/timetable";
import { useTRPC } from "@/trpc/react";
import { Protect } from "@clerk/nextjs";
import { Button } from "@instello/ui/components/button";
import { PlusIcon, TableIcon } from "@phosphor-icons/react";
import { IconCircleArrowUp } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";

export function TimetableClient() {
  const { branchId, slug, semesterId } = useParams<{
    branchId: string;
    slug: string;
    semesterId: string;
  }>();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.timetable.findByActiveSemester.queryOptions({ branchId }),
  );

  if (!data.timetableData)
    return (
      <div className="flex h-[calc(100vh-180px)] flex-col items-center justify-center gap-2.5">
        <TableIcon className="text-primary/40 size-20" weight="duotone" />
        <div className="text-xl font-medium">No timetable created</div>
        <p className="text-muted-foreground max-w-md text-center text-sm">
          Create new week schedule for the selected branch and semester by click
          on new button up there
        </p>
      </div>
    );

  const timetableSlots = data.timetableData.timetableSlots.map((s) => ({
    ...s,
    subjectName: s.subject.name,
  }));

  return (
    <React.Fragment>
      <div className="inline-flex w-full justify-between">
        <h2 className="text-3xl font-semibold">Timetable</h2>
        <Protect permission={"org:timetables:create"}>
          <Button asChild>
            <Link href={`/${slug}/b/${branchId}/s/${semesterId}/timetable/new`}>
              <PlusIcon />
              New
            </Link>
          </Button>
        </Protect>
      </div>

      <div className="bg-accent/80 text-accent-foreground flex w-full items-center justify-between gap-1.5 rounded-lg border p-2.5">
        <div className="inline-flex items-center gap-2.5">
          <IconCircleArrowUp
            strokeWidth={1.25}
            className="text-primary size-5"
          />
          <p className="text-muted-foreground text-sm">
            {data.timetableData.message}
          </p>
        </div>

        <time className="text-muted-foreground text-xs">
          Updated{" "}
          {formatDistanceToNowStrict(data.timetableData.createdAt, {
            addSuffix: true,
          })}
        </time>
      </div>
      <ReactTimetable timetableSlots={timetableSlots} />
    </React.Fragment>
  );
}
