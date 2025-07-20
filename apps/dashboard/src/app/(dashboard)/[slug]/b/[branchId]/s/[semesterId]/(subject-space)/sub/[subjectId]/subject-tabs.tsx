"use client";

import type { IconPickerIcon } from "@/components/icon-picker";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { TablerReactIcon } from "@/components/icon-picker";
import { useTRPC } from "@/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@instello/ui/components/breadcrumb";
import { Separator } from "@instello/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";
import { CalendarCheckIcon, PercentIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

const items = [
  {
    title: "Attendance",
    url: "",
    icon: CalendarCheckIcon,
    exact: true,
  },
  {
    title: "Marks",
    url: "/marks",
    icon: PercentIcon,
  },
];

export function SubjectTabs() {
  const { slug, branchId, semesterId, subjectId } = useParams<{
    slug: string;
    branchId: string;
    semesterId: string;
    subjectId: string;
  }>();
  const baseUrl = `/${slug}/b/${branchId}/s/${semesterId}/sub/${subjectId}`;

  const pathname = usePathname();
  const router = useRouter();
  const trpc = useTRPC();
  const { data: subject } = useSuspenseQuery(
    trpc.subject.getBySubjectId.queryOptions({ branchId, subjectId }),
  );
  const { data: branch } = useSuspenseQuery(
    trpc.branch.getByBranchId.queryOptions({ branchId }),
  );

  return (
    <div className="inline-flex w-full items-center gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${slug}/b/${branchId}/s/${semesterId}`}>
                <TablerReactIcon
                  isActive
                  name={branch?.icon as IconPickerIcon}
                  className="size-6 [&>svg]:!size-4"
                />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${slug}/b/${branchId}/s/${semesterId}/subjects`}>
                Subjects
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subject?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
