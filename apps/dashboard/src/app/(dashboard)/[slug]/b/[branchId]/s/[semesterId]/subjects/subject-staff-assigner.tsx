"use client";

import { OrganizationMembershipsCommand } from "@/components/organization-memberships.command";
import { Avatar, AvatarFallback } from "@instello/ui/components/avatar";
import { Button } from "@instello/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@instello/ui/components/popover";
import { UserIcon } from "@phosphor-icons/react";

export function SubjectStaffAssigner({
  staffUserId,
}: {
  staffUserId?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-muted-foreground font-normal"
        >
          <Avatar className="size-6 border border-dashed bg-transparent">
            <AvatarFallback className="text-muted-foreground bg-transparent">
              <UserIcon weight="duotone" />
            </AvatarFallback>
          </Avatar>{" "}
          Assign...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <OrganizationMembershipsCommand value={staffUserId} />
      </PopoverContent>
    </Popover>
  );
}
