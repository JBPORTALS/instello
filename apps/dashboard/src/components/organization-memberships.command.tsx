"use client";

import { useOrganization } from "@clerk/nextjs";
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
import { BuildingsIcon, CheckIcon, SpinnerIcon } from "@phosphor-icons/react";

interface OrganizationMembershipsCommandProps {
  /** Staff UserId */
  value: string;
  onValueChange?: (value: string) => void;
}

export function OrganizationMembershipsCommand({
  value,
  onValueChange,
}: OrganizationMembershipsCommandProps) {
  const { isLoaded, memberships } = useOrganization({
    memberships: { role: ["org:staff"] },
  });

  if (!isLoaded)
    return (
      <div className="flex min-h-20 w-full items-center justify-center">
        <SpinnerIcon className="animate-spin" />
      </div>
    );

  return (
    <Command>
      <CommandInput placeholder="Search organization..." />
      <CommandList>
        <CommandEmpty>No staff found.</CommandEmpty>
        <CommandGroup>
          <Label className="text-muted-foreground my-1 text-xs">
            Organization Staff
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
                <BuildingsIcon weight="duotone" />
                {membership.organization.name}
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
