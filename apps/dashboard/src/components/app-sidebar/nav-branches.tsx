"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@instello/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@instello/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@instello/ui/components/tooltip";
import {
  BookIcon,
  PlusIcon,
  TableIcon,
  TriangleIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

import { CreateBranchDialog } from "../create-branch-dialog";
import { IconPickerIcon, TablerReactIcon } from "../icon-picker";

const items = [
  {
    title: "Students",
    icon: UsersThreeIcon,
    url: "/students",
  },
  {
    title: "Subjects",
    icon: BookIcon,
    url: "/subjects",
  },
  {
    title: "Timetable",
    icon: TableIcon,
    url: "/timetable",
  },
];

const branches = [
  { id: "1", name: "Computer Science", icon: "IconCircleFilled" },
  { id: "2", name: "Automobile Engineering", icon: "IconCircleFilled" },
];

export function NavBranches() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();

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
        {branches.map((b) => {
          const branchUrl = `/${slug}/teams/${b.id}`;
          const isActive = pathname == branchUrl;

          return (
            <Collapsible key={b.id}>
              <SidebarMenuItem className="items-center">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="font-medium"
                >
                  <Link href={branchUrl}>
                    <TablerReactIcon
                      name={b.icon as IconPickerIcon}
                      isActive
                      className="size-5 [&_svg]:size-3.5"
                    />
                    <span className="max-w-full truncate pr-2">{b.name}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <TriangleIcon
                      weight="fill"
                      className="text-muted-foreground rotate-90"
                    />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenu>
                    {items.map((subItem) => {
                      const subItemUrl = `${branchUrl}${subItem.url}`;
                      const isActive = pathname.startsWith(subItemUrl);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={isActive}
                            className="px-5"
                            asChild
                          >
                            <Link href={subItemUrl}>
                              <subItem.icon
                                weight="duotone"
                                className="text-muted-foreground"
                              />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
