"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";
import { HouseIcon } from "@phosphor-icons/react";

const items = [{ title: "Home", url: "/", icon: HouseIcon }];

export function NavMain() {
  const pathname = usePathname();

  return (
    <>
      {items.map((item, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton asChild isActive={pathname === item.url}>
            <Link href={item.url}>
              <item.icon weight="duotone" /> {item.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
