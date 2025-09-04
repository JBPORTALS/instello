"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@instello/ui/components/breadcrumb";
import { CircleIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function ChannelBreadcrumb() {
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.channel.getById.queryOptions({ channelId }),
  );
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1.5">
            <CircleIcon weight="duotone" />
            {data?.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
