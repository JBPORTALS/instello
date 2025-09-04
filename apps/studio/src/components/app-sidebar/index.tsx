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
          <div className="text-lg font-bold">Instello Studio</div>
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
