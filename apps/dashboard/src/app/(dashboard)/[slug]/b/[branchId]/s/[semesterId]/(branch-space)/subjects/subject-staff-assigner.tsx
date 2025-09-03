"use client";

import React from "react";
import { useParams } from "next/navigation";
import { OrganizationMembershipsCommand } from "@/components/organization-memberships.command";
import { useTRPC } from "@/trpc/react";
import { useOrganization } from "@clerk/nextjs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import { Button } from "@instello/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@instello/ui/components/popover";
import { Skeleton } from "@instello/ui/components/skeleton";
import { cn } from "@instello/ui/lib/utils";
import { UserIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function SubjectStaffAssigner({
  staffUserId,
  subjectId,
}: {
  staffUserId?: string | null;
  subjectId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { memberships, isLoaded } = useOrganization({ memberships: true });
  const { branchId } = useParams<{ branchId: string }>();
  const { mutateAsync: assignStaff } = useMutation(
    trpc.erp.subject.assignStaff.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.erp.subject.list.queryFilter(),
        );
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );
  const staff = memberships?.data?.find(
    (membership) => membership.publicUserData?.userId === staffUserId,
  );

  if (memberships?.isLoading || !isLoaded)
    return <Skeleton className="h-8 w-32" />;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-muted-foreground font-normal"
        >
          <Avatar
            className={cn(
              "size-6 border bg-transparent",
              !staffUserId && "border-dashed",
            )}
          >
            <AvatarImage src={staff?.publicUserData?.imageUrl} />
            <AvatarFallback className="text-muted-foreground bg-transparent">
              <UserIcon weight="duotone" />
            </AvatarFallback>
          </Avatar>{" "}
          {staff ? (
            <>
              {staff.publicUserData?.firstName} {staff.publicUserData?.lastName}
            </>
          ) : (
            "No assignee"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" align="start" className="w-[200px] p-0">
        <OrganizationMembershipsCommand
          onValueChange={async (staffClerkUserId) => {
            await assignStaff({
              branchId,
              staffClerkUserId,
              subjectId,
            });
          }}
          value={staffUserId}
        />
      </PopoverContent>
    </Popover>
  );
}
