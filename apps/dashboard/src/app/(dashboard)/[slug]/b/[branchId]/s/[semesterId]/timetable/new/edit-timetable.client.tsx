"use client";

import { useParams } from "next/navigation";
import { ReactTimetable } from "@/components/timetable";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function TimetableClient() {
  const { branchId } = useParams<{ branchId: string }>();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.timetable.findByActiveSemester.queryOptions({ branchId }),
  );

  return (
    <ReactTimetable
      timetableSlots={data.timetableData?.timetableSlots ?? []}
      editable
    />
  );
}
