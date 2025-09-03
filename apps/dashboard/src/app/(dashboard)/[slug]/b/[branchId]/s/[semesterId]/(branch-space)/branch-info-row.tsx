"use client";

import type { IconPickerIcon } from "@/components/icon-picker";
import { useParams } from "next/navigation";
import { TablerReactIcon } from "@/components/icon-picker";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function BranchInfoRow() {
  const trpc = useTRPC();
  const { branchId } = useParams<{ branchId: string }>();
  const { data } = useSuspenseQuery(
    trpc.erp.branch.getByBranchId.queryOptions({ branchId }),
  );

  return (
    <div>
      <div className="inline-flex items-center gap-2.5">
        <TablerReactIcon
          isActive
          name={data?.icon as IconPickerIcon}
          className="size-12 [&>svg]:!size-8"
        />
        <h3 className="min-h-8 w-full text-3xl font-semibold outline-none">
          {data?.name}
        </h3>
      </div>
    </div>
  );
}
