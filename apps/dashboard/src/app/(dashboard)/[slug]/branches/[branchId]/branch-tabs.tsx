"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { IconPickerIcon, TablerReactIcon } from "@/components/icon-picker";
import { useTRPC } from "@/trpc/react";
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
  const { slug, branchId } = useParams<{ slug: string; branchId: string }>();
  const baseUrl = `/${slug}/branches/${branchId}`;

  const pathname = usePathname();
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.branch.getByBranchId.queryOptions({ branchId }),
  );

  return (
    <div className="inline-flex w-full gap-6">
      <div className="inline-flex items-center gap-2.5">
        <TablerReactIcon
          isActive
          name={data?.icon as IconPickerIcon}
          className="size-6 [&>svg]:!size-4"
        />
        <h3 className="font-medium outline-none">{data?.name}</h3>
      </div>
      <Tabs value={pathname}>
        <TabsList>
          {items.map((item, i) => (
            <TabsTrigger
              onClick={() => router.push(`${baseUrl}${item.url}`)}
              key={i}
              value={`${baseUrl}${item.url}`}
            >
              <item.icon />
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
