"use client";

import { useParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export default function DataTableClient() {
  const trpc = useTRPC();
  const { branchId } = useParams<{ branchId: string }>();
  const { data } = useSuspenseQuery(
    trpc.erp.subject.list.queryOptions({ branchId }),
  );

  return <DataTable columns={columns} data={data} />;
}
