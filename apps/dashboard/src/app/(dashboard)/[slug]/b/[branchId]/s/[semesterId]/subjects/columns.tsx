"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@instello/ui/components/avatar";
import { Button } from "@instello/ui/components/button";
import { DotsThreeIcon, UserIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = RouterOutputs["subject"]["list"][number];

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      return <div className="min-w-4xl">{props.getValue() as string}</div>;
    },
  },
  {
    id: "alloted-staff",
    header: () => <div className="px-3.5">Alloted</div>,
    cell() {
      return (
        <div>
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
        </div>
      );
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
