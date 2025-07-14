"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";

export function SemesterSwitcher() {
  const trpc = useTRPC();
  const { branchId } = useParams<{ branchId: string }>();
  const { data } = useSuspenseQuery(
    trpc.branch.getSemesterList.queryOptions({ branchId }),
  );

  return (
    <Tabs>
      <TabsList className="h-9 bg-transparent">
        {data.map((semester) => (
          <TabsTrigger
            className="text-xs"
            key={semester.id}
            value={`${semester.id}`}
          >
            SEM {semester.value}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
