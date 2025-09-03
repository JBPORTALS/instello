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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";
import { HouseIcon, PlusIcon } from "@phosphor-icons/react/ssr";

import { CreateChannelDialog } from "../dialogs/create-channel-dialog";
import { NavChannels } from "./nav-channels";

export function AppSidebar() {
  prefetch(trpc.lms.channel.list.queryOptions());

  return (
    <HydrateClient>
      <Sidebar>
        <SidebarHeader>
          <div className="text-lg font-bold">Instello Studio</div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HouseIcon weight="duotone" /> Home
              </SidebarMenuButton>
            </SidebarMenuItem>
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
