"use client";

import { useParams } from "next/navigation";
import { ReactTimetable } from "@/components/timetable";
import { useTRPC } from "@/trpc/react";
import { TableIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function TimetableClient() {
  const { branchId } = useParams<{ branchId: string }>();
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

  return <ReactTimetable timetableSlots={timetableSlots} />;
}
