"use client";

import { useOrganization } from "@clerk/nextjs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@instello/ui/components/command";
import { Label } from "@instello/ui/components/label";
import { cn } from "@instello/ui/lib/utils";
import { CheckIcon, SpinnerIcon } from "@phosphor-icons/react";

interface OrganizationMembershipsCommandProps {
  /** Staff UserId */
  value?: string;
  onValueChange?: (value: string) => void;
}

export function OrganizationMembershipsCommand({
  value,
  onValueChange,
}: OrganizationMembershipsCommandProps) {
  const { isLoaded, memberships } = useOrganization({
    memberships: { role: ["org:staff"] },
  });

  if (!isLoaded || memberships?.isLoading)
    return (
      <div className="flex min-h-20 w-full items-center justify-center">
        <SpinnerIcon className="size-5 animate-spin" />
      </div>
    );

  return (
    <Command>
      <CommandInput placeholder="Search organization..." />
      <CommandList>
        <CommandEmpty>No staff found.</CommandEmpty>
        <CommandGroup>
          <Label className="text-muted-foreground my-1.5 px-1.5 text-xs">
            Organization Members
          </Label>
          {memberships?.data?.map((membership) => (
            <CommandItem
              className="justify-between"
              key={membership.id}
              value={membership.publicUserData?.userId}
              onSelect={(value) => {
                onValueChange?.(value);
              }}
            >
              <span className="inline-flex items-center gap-2.5">
                <Avatar className="size-6">
                  <AvatarImage src={membership.publicUserData?.imageUrl} />
                  <AvatarFallback>
                    {membership.publicUserData?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {membership.publicUserData?.firstName}{" "}
                {membership.publicUserData?.lastName}
              </span>
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  value === membership.publicUserData?.userId
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
