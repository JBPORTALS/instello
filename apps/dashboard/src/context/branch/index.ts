import { cache } from "react";
import { cookies } from "next/headers";
import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";

export const getBranchCookie = cache(async () => {
  const ck = await cookies();
  const branchRaw = ck.get("branch");

  if (!branchRaw?.value) return undefined;

  const branch = JSON.parse(branchRaw.value) as Record<string, number>;

  return branch;
});

export const getBranch = cache(async ({ branchId }: { branchId: string }) => {
  const queryClient = createQueryClient();
  const branch = await queryClient.fetchQuery(
    trpc.branch.getByBranchId.queryOptions({ branchId }),
  );

  if (!branch) throw new Error("Couldn't able to fetch branch");
  const semesters = Array.from(
    { length: branch.totalSemesters },
    (_, i) => i + 1,
  ).filter((n) =>
    branch.currentSemesterMode == "odd" ? n % 2 === 1 : n % 2 === 0,
  );
  return { ...branch, semesters };
});
