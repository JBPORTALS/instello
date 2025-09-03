"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@instello/ui/components/avatar";
import { Badge } from "@instello/ui/components/badge";
import { Button } from "@instello/ui/components/button";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = RouterOutputs["erp"]["student"]["list"][number];

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "fullName",
    header: "Student",
    cell(props) {
      return (
        <div className="inline-flex min-w-3xl items-center gap-2 font-medium">
          <Avatar>
            <AvatarFallback>
              {props.row.original.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {props.getValue() as string}
        </div>
      );
    },
  },

  {
    accessorKey: "usn",
    header: "USN",
    cell(props) {
      return <Badge variant={"secondary"}>{props.getValue() as string}</Badge>;
    },
  },

  {
    accessorKey: "emailAddress",
    header: "Email Address",
    cell(props) {
      return <div>{props.getValue() as string}</div>;
    },
  },

  {
    accessorKey: "createdAt",
    maxSize: 90,
    header: "Created",
    cell(props) {
      return (
        <div>
          <time className="text-muted-foreground text-sm">
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
