"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@instello/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@instello/ui/components/tooltip";
import { PlusIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { IconPickerIcon } from "../icon-picker";
import { CreateBranchDialog } from "../create-branch-dialog";
import { TablerReactIcon } from "../icon-picker";

export function NavBranches() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();
  const trpc = useTRPC();
  const branches = useSuspenseQuery(trpc.branch.list.queryOptions());

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Branches</SidebarGroupLabel>

      <Tooltip>
        <TooltipTrigger asChild>
          <CreateBranchDialog>
            <SidebarGroupAction>
              <PlusIcon />
            </SidebarGroupAction>
          </CreateBranchDialog>
        </TooltipTrigger>

        <TooltipContent side="right">Create Branch</TooltipContent>
      </Tooltip>
      <SidebarMenu>
        {branches.data.map((b) => {
          const branchUrl = `/${slug}/b/${b.id}`;
          const isActive = pathname.startsWith(branchUrl);

          return (
            <SidebarMenuItem key={b.id} className="items-center">
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="font-medium"
              >
                <Link href={branchUrl}>
                  <TablerReactIcon
                    name={b.icon as IconPickerIcon}
                    isActive
                    className="size-5 [&_svg]:!size-3"
                  />
                  <span className="max-w-full truncate pr-2">{b.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
