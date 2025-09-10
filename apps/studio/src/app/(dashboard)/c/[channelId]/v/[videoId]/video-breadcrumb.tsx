"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@instello/ui/components/breadcrumb";
import { CircleIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function VideoPageBreadcrumb() {
  const trpc = useTRPC();
  const { channelId, videoId } = useParams<{
    channelId: string;
    videoId: string;
  }>();
  const { data: channel } = useSuspenseQuery(
    trpc.lms.channel.getById.queryOptions({ channelId }),
  );
  const { data: video } = useSuspenseQuery(
    trpc.lms.video.getById.queryOptions({ videoId }),
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="flex items-center gap-1.5">
            <Link href={`/c/${channelId}`}>
              <CircleIcon weight="duotone" />
              {channel?.title}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{video?.chapter.title}</BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{video?.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
