import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@instello/ui/components/sidebar";

import { NavHeader } from "./nav-header";
import { NavMain } from "./nav-main";

export function VideoSidebar() {
  return (
    <Sidebar>
      <NavHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavMain />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
