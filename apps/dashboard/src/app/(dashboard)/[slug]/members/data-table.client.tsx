"use client";

import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/react";
import { Spinner } from "@instello/ui/components/spinner";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export default function DataTableClient() {
  const trpc = useTRPC();
  const { data, isFetching } = useSuspenseQuery(
    trpc.organization.getOrganizationMembers.queryOptions(),
  );

  if (isFetching)
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );

  return <DataTable columns={columns} data={data.members} />;
}
