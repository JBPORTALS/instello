"use client";

import type { IconPickerIcon } from "@/components/icon-picker";
import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { TablerReactIcon } from "@/components/icon-picker";
import { useTRPC } from "@/trpc/react";
import { Separator } from "@instello/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";
import {
  BooksIcon,
  CheckerboardIcon,
  GraduationCapIcon,
  TableIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

const items = [
  {
    title: "Overview",
    url: "",
    icon: CheckerboardIcon,
    exact: true,
  },
  {
    title: "Students",
    url: "/students",
    icon: GraduationCapIcon,
  },
  {
    title: "Subjects",
    url: "/subjects",
    icon: BooksIcon,
  },
  {
    title: "Timetable",
    url: "/timetable",
    icon: TableIcon,
  },
];

export function BranchTabs() {
  const { slug, branchId, semesterId } = useParams<{
    slug: string;
    branchId: string;
    semesterId: string;
  }>();
  const baseUrl = `/${slug}/b/${branchId}/s/${semesterId}`;

  const pathname = usePathname();
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.erp.branch.getByBranchId.queryOptions({ branchId }),
  );

  return (
    <div className="inline-flex w-full items-center gap-3">
      <TablerReactIcon
        isActive
        name={data?.icon as IconPickerIcon}
        className="size-6 [&>svg]:!size-4"
      />
      <Separator orientation="vertical" className="!h-4" />
      <Tabs value={pathname}>
        <TabsList className="h-9">
          {items.map((item, i) => (
            <TabsTrigger
              onClick={() => router.push(`${baseUrl}${item.url}`)}
              key={i}
              value={`${baseUrl}${item.url}`}
              className="text-xs"
            >
              <item.icon weight="duotone" />
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
