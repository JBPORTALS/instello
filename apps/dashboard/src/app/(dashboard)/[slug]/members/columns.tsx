"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member =
  RouterOutputs["organization"]["getOrganizationMembers"]["members"][number];

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },

  {
    accessorKey: "role",
    header: "Role",
  },

  {
    accessorKey: "createdAt",
    header: () => <div className="ml-auto w-20 px-3 text-right">Created</div>,
    cell(props) {
      return (
        <div className="ml-auto max-w-max min-w-20 px-3">
          <time className="text-muted-foreground text-sm">
            {formatDistanceToNowStrict(props.getValue() as Date, {
              addSuffix: true,
            })}
          </time>
        </div>
      );
    },
  },
];
