"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@instello/ui/components/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@instello/ui/components/tooltip";
import {
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function ChannelPageBreadcrumb() {
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
            {data.isPublished ? (
              <GlobeHemisphereEastIcon weight="duotone" />
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <LockLaminatedIcon />
                </TooltipTrigger>
                <TooltipContent>Private</TooltipContent>
              </Tooltip>
            )}
            {data.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
