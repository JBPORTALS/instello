"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = RouterOutputs["subject"]["list"][number];

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "name",
  },

  {
    accessorKey: "createdAt",
    header: () => <div className="ml-auto w-20">Created</div>,
    cell(props) {
      return (
        <time className="ml-auto w-20">
          {formatDistanceToNowStrict(props.getValue() as Date, {
            addSuffix: true,
          })}
        </time>
      );
    },
  },
];
