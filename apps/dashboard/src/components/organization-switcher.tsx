"use client";

import React from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";
import { Badge } from "@instello/ui/components/badge";
import { Button } from "@instello/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@instello/ui/components/command";
import { Label } from "@instello/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@instello/ui/components/popover";
import { Skeleton } from "@instello/ui/components/skeleton";
import { cn } from "@instello/ui/lib/utils";
import {
  BuildingsIcon,
  CaretUpDownIcon,
  CheckIcon,
} from "@phosphor-icons/react";

export function OrganizationSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { slug } = useParams<{ slug: string }>();
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: true,
  });
  const router = useRouter();

  const setActiveOrganization = React.useCallback(
    async (slug: string) => {
      const organization = userMemberships.data?.find(
        (membership) => membership.organization.slug === slug,
      )?.organization;

      // if slug is not existed within the memebership organization list then show not found page
      if (!organization) notFound();

      await setActive?.({ organization });
    },
    [setActive, userMemberships.data],
  );

  React.useEffect(() => {
    setActiveOrganization(slug).catch((e) => console.log(e));
  }, [slug, setActiveOrganization]);

  if (!isLoaded || userMemberships.isLoading)
    return <Skeleton className="h-9 w-full border" />;

  const membership = userMemberships.data.find(
    (membership) => membership.organization.slug === slug,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="inline-flex items-center gap-3.5">
            <BuildingsIcon
              className="text-muted-foreground size-5"
              weight="duotone"
            />
            {slug ? (
              <>
                {membership?.organization.name}{" "}
                {membership?.role !== "org:admin" && (
                  <Badge className="h-5 text-xs" variant={"outline"}>
                    {membership?.roleName}
                  </Badge>
                )}
              </>
            ) : (
              "Select organization..."
            )}
          </span>
          <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8} alignOffset={9} className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              <Label className="text-muted-foreground my-1 text-xs">
                Your Organizations
              </Label>
              {userMemberships.data.map((membership) => (
                <CommandItem
                  className="justify-between"
                  key={membership.id}
                  onSelect={() => {
                    router.push(`/${membership.organization.slug}`);
                    setOpen(false);
                  }}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <BuildingsIcon weight="duotone" />
                    {membership.organization.name}
                  </span>
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      slug === membership.organization.slug
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
