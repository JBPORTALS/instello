import Image from "next/image";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@instello/ui/components/sidebar";
import { PlusIcon } from "@phosphor-icons/react/ssr";

import { CreateChannelDialog } from "../dialogs/create-channel-dialog";
import { NavChannels } from "./nav-channels";
import { NavMain } from "./nav-main";

export function AppSidebar() {
  prefetch(trpc.lms.channel.list.queryOptions());

  return (
    <HydrateClient>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu className="h-11 flex-row items-center gap-2 px-2">
            <Image
              src={`/instello.svg`}
              width={100}
              height={48}
              alt="Instello Logo"
            />{" "}
            <span className="text-xl">·</span>
            <span className="mt-1 text-lg font-bold text-[#F2B900]">
              STUDIO
            </span>
          </SidebarMenu>
          <SidebarMenu>
            <NavMain />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Channels
              <CreateChannelDialog>
                <SidebarGroupAction asChild>
                  <Button
                    size={"icon"}
                    className="size-5 [&>svg]:size-4"
                    variant={"outline"}
                  >
                    <PlusIcon />
                  </Button>
                </SidebarGroupAction>
              </CreateChannelDialog>
            </SidebarGroupLabel>
            <SidebarMenu>
              <NavChannels />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
    </HydrateClient>
  );
}
