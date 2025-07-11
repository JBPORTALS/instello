import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";

import { NavBranches } from "./nav-branches";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  if (!user) return null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src={"/instello-feather.svg"}
                  height={28}
                  width={28}
                  alt="Instello Feather"
                />
                <span className="text-base font-semibold">
                  Organization Name
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavBranches />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            imageUrl: user.imageUrl,
            fullName: user.fullName,
            primaryEmailAddress: user.primaryEmailAddress?.emailAddress,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
