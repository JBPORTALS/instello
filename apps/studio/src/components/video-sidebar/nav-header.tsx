"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@instello/ui/components/sidebar";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function NavHeader() {
  const { channelId, videoId } = useParams<{
    channelId: string;
    videoId: string;
  }>();
  const router = useRouter();
  const trpc = useTRPC();
  const { data: video } = useSuspenseQuery(
    trpc.lms.video.getById.queryOptions({ videoId }),
  );

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton
          onClick={() => router.push(`/c/${channelId}`)}
          size={"lg"}
        >
          <ArrowLeftIcon weight="duotone" /> Channel content
        </SidebarMenuButton>
      </SidebarMenu>
      <div className="bg-accent relative aspect-video h-32 w-full overflow-hidden rounded-md">
        <Image
          fill
          src={`https://image.mux.com/${video?.playbackId}/thumbnail.png?width=214&height=121&time=15`}
          alt=""
        />
      </div>
      <span className="px-2 text-sm font-semibold">Chapter video</span>
      <p className="text-muted-foreground max-w-full truncate px-2 text-xs">
        {video?.title}
      </p>
    </SidebarHeader>
  );
}
