"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";

const SEMESTER_COOKIE_NAME = "semester";
const SEMESTER_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function SemesterSwitcher({
  defaultSemesterCookie,
}: {
  defaultSemesterCookie: string;
}) {
  const trpc = useTRPC();
  const { branchId, slug, semesterId } = useParams<{
    branchId: string;
    semesterId: string;
    slug: string;
  }>();
  const { data } = useSuspenseQuery(
    trpc.erp.branch.getSemesterList.queryOptions({ branchId }),
  );
  const router = useRouter();

  React.useEffect(() => {
    document.cookie = `${SEMESTER_COOKIE_NAME}=${JSON.stringify({ ...JSON.parse(defaultSemesterCookie), [branchId]: semesterId })}; path=/; max-age=${SEMESTER_COOKIE_MAX_AGE}`;
  }, [semesterId, branchId, defaultSemesterCookie]);

  return (
    <Tabs defaultValue={semesterId}>
      <TabsList className="h-9 bg-transparent">
        {data.map((semester) => (
          <TabsTrigger
            className="text-xs"
            key={semester.id}
            value={`${semester.id}`}
            onClick={() =>
              router.push(`/${slug}/b/${branchId}/s/${semester.id}`)
            }
          >
            SEM {semester.value}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
