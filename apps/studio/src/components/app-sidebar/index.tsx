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
import { CircleIcon, HouseIcon, PlusIcon } from "@phosphor-icons/react/ssr";

import { CreateChannelDialog } from "../dialogs/create-channel-dialog";

const channels = [
  {
    id: "1",
    name: "Artificial Intelligence",
  },
  { id: "2", name: "Applied Mathemetics" },
  { id: "3", name: "Chemical Science" },
];

export function AppSidebar() {
  return (
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
            {channels.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton>
                  <CircleIcon weight="duotone" />
                  {item.name}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
