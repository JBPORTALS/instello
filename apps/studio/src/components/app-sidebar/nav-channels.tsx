"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@instello/ui/components/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";
import {
  BackspaceIcon,
  DotsThreeIcon,
  FolderIcon,
  FolderLockIcon,
  FolderOpenIcon,
  GearFineIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ChannelSettingsDialog } from "../dialogs/channel-settings-dialog";
import { DeleteChannelDialog } from "../dialogs/delete-channel-dialog";

export function NavChannels() {
  const trpc = useTRPC();
  const pathname = usePathname();
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
        <DropdownMenu key={item.id}>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === `/c/${item.id}`} asChild>
              <Link href={`/c/${item.id}`}>
                {pathname === `/c/${item.id}` ? (
                  <FolderOpenIcon weight="duotone" />
                ) : (
                  <>
                    {item.isPublished ? (
                      <FolderIcon weight={"duotone"} />
                    ) : (
                      <FolderLockIcon weight="duotone" />
                    )}
                  </>
                )}

                {item.title}
              </Link>
            </SidebarMenuButton>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:bg-sidebar-accent opacity-0 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100">
                <DotsThreeIcon weight="duotone" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Actions
                </DropdownMenuLabel>
                <ChannelSettingsDialog channelId={item.id}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <GearFineIcon weight="duotone" /> Settings...
                  </DropdownMenuItem>
                </ChannelSettingsDialog>
                <DeleteChannelDialog channelId={item.id}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    variant="destructive"
                  >
                    <BackspaceIcon weight="duotone" /> Delete forever...
                  </DropdownMenuItem>
                </DeleteChannelDialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </SidebarMenuItem>
        </DropdownMenu>
      ))}
    </>
  );
}
