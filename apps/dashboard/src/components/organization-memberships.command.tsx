"use client";

import type { PublicUserData } from "@clerk/types";
import React from "react";
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
import { Spinner } from "@instello/ui/components/spinner";
import { cn } from "@instello/ui/lib/utils";
import { CheckIcon, UserIcon } from "@phosphor-icons/react";

interface OrganizationMembershipsCommandProps {
  /** Staff UserId */
  value?: string | null;
  onValueChange?: (value?: string | null) => Promise<void> | void;
}

export function OrganizationMembershipsCommand({
  ...props
}: OrganizationMembershipsCommandProps) {
  const { isLoaded, memberships } = useOrganization({
    memberships: { role: ["org:staff"], infinite: true },
  });

  if (!isLoaded) return null;

  return (
    <Command>
      <CommandInput placeholder="Search..." />
      {memberships?.isLoading ? (
        <div className="flex min-h-20 w-full items-center justify-center">
          <Spinner className="size-5" />
        </div>
      ) : (
        <CommandList>
          <CommandEmpty>No staff found.</CommandEmpty>
          <CommandGroup>
            <OrganizationMembershipsCommandNoAssigneeItem {...props} />
          </CommandGroup>
          <CommandGroup>
            <Label className="text-muted-foreground px-1.5 py-1.5 text-xs">
              Organization Members
            </Label>
            {memberships?.data?.map((membership) => (
              <OrganizationMembershipsCommandItem
                key={membership.id}
                membership={membership}
                {...props}
              />
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}

function OrganizationMembershipsCommandNoAssigneeItem({
  value,
  onValueChange,
}: OrganizationMembershipsCommandProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <CommandItem
      className="justify-between"
      onSelect={() => {
        if (value !== null) {
          setIsLoading(true);
          onValueChange?.(null)
            ?.then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
        }
      }}
    >
      <span className="inline-flex items-center gap-2.5">
        <Avatar className="size-6 border border-dashed bg-transparent">
          <AvatarFallback className="text-muted-foreground bg-transparent">
            <UserIcon weight="duotone" />
          </AvatarFallback>
        </Avatar>
        No assignee
      </span>

      {isLoading ? (
        <Spinner />
      ) : (
        <CheckIcon
          className={cn(
            "mr-2 h-4 w-4",
            value === null ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </CommandItem>
  );
}

function OrganizationMembershipsCommandItem({
  membership,
  value,
  onValueChange,
}: OrganizationMembershipsCommandProps & {
  membership: {
    id: string;
    publicUserData?: PublicUserData;
  };
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <CommandItem
      className="justify-between"
      key={membership.id}
      value={membership.publicUserData?.userId}
      onSelect={(selectedValue) => {
        if (selectedValue !== value) {
          setIsLoading(true);
          onValueChange?.(selectedValue)
            ?.then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
        }
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

      {isLoading ? (
        <Spinner />
      ) : (
        <CheckIcon
          className={cn(
            "mr-2 h-4 w-4",
            value === membership.publicUserData?.userId
              ? "opacity-100"
              : "opacity-0",
          )}
        />
      )}
    </CommandItem>
  );
}
