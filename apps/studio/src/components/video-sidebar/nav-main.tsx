"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";
import { ChartLineUpIcon, PenNibIcon } from "@phosphor-icons/react";

const items = [
  { title: "Details", url: "", icon: PenNibIcon },
  { title: "Analytics", url: "/analytics", icon: ChartLineUpIcon },
];

export function NavMain() {
  const { channelId, videoId } = useParams<{
    channelId: string;
    videoId: string;
  }>();
  const pathname = usePathname();

  return (
    <>
      {items.map((item, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton
            size={"lg"}
            asChild
            isActive={pathname === `/c/${channelId}/v/${videoId}${item.url}`}
          >
            <Link href={`/c/${channelId}/v/${videoId}${item.url}`}>
              <item.icon weight="duotone" /> {item.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
