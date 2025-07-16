"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Protect } from "@clerk/nextjs";
import { Button } from "@instello/ui/components/button";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";

import { SubjectStaffAssigner } from "./subject-staff-assigner";

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
    id: "staff-assigned",

    enableHiding: true,
    cell(props) {
      return (
        <Protect permission="org:subjects:update">
          <div className="w-[200px]">
            <SubjectStaffAssigner
              subjectId={props.row.original.id}
              staffUserId={props.row.original.staffClerkUserId}
            />
          </div>
        </Protect>
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
