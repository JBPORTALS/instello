"use client";

import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/react";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export default function DataTableClient() {
  const trpc = useTRPC();
  const { data, isRefetching } = useSuspenseQuery(
    trpc.organization.getInviationList.queryOptions(),
  );

  if (isRefetching)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <SpinnerIcon className="size-5 animate-spin" />
      </div>
    );

  return <DataTable columns={columns} data={data.invitations} />;
}
