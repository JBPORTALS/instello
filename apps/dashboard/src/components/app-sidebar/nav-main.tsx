"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";
import { HouseLineIcon, UsersIcon } from "@phosphor-icons/react";

const items = [
  {
    title: "Home",
    url: "",
    icon: HouseLineIcon,
    exact: true,
  },
  {
    title: "Members",
    url: "/members",
    icon: UsersIcon,
  },
];

export function NavMain() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const url = `/${slug}${item.url}`;
            const isActive = item.exact
              ? pathname == url
              : pathname.startsWith(url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={isActive} asChild>
                  <Link href={url}>
                    <item.icon
                      weight="duotone"
                      className="text-muted-foreground"
                    />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
