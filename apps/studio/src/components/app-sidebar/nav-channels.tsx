"use client";

import { useTRPC } from "@/trpc/react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";
import { CircleIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function NavChannels() {
  const trpc = useTRPC();
  const { data: channels } = useSuspenseQuery(
    trpc.lms.channel.list.queryOptions(),
  );

  if (channels.length == 0)
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-1.5 rounded-md px-4">
        <p className="text-sm font-medium">No channels</p>
        <small className="text-muted-foreground text-center text-xs">
          Channels are the medium to segregate your different content in form of
          courses. Create one by clicking on the plus button on the top
        </small>
      </div>
    );

  return (
    <>
      {channels.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton>
            <CircleIcon weight="duotone" />
            {item.title}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
