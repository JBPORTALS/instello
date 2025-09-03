"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import { Badge } from "@instello/ui/components/badge";
import { Button } from "@instello/ui/components/button";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member =
  RouterOutputs["erp"]["organization"]["getOrganizationMembers"]["members"][number];

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "fullName",
    header: "Member",
    cell(props) {
      const original = props.row.original;
      return (
        <div className="inline-flex w-[800px] items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage src={original.imageUrl} />
            <AvatarFallback>{original.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <p>{original.fullName}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "emailAddress",
    header: "Email Address",
    cell(props) {
      return (
        <p className="text-muted-foreground max-w-lg">
          {props.getValue() as string}
        </p>
      );
    },
  },
  {
    accessorKey: "roleName",
    header: "Role",
    cell(props) {
      const original = props.row.original;
      return (
        <Badge variant={original.role == "org:admin" ? "outline" : "secondary"}>
          {props.getValue() as string}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: () => <div className="ml-auto w-20 px-3 text-right">Joined</div>,
    cell(props) {
      return (
        <div className="ml-auto max-w-max min-w-20 px-3">
          <time className="text-muted-foreground text-xs">
            {formatDistanceToNowStrict(props.getValue() as Date, {
              addSuffix: true,
            })}
          </time>
        </div>
      );
    },
  },

  {
    id: "more-action",
    cell() {
      return (
        <div className="text-right">
          <Button
            variant={"ghost"}
            className="opacity-0 group-hover:opacity-100"
            size={"icon"}
          >
            <DotsThreeIcon weight="bold" />
          </Button>
        </div>
      );
    },
  },
];
