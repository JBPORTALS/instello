"use client";

import type { SemesterMode } from "@instello/db/schema";
import React from "react";
import { useParams } from "next/navigation";

const BranchContext = React.createContext<{
  activeSemester: number;
  setActiveSemester: (value: number) => void;
} | null>(null);

/** All config in current selected team */
export const useBranch = () => {
  const team = React.useContext(BranchContext);
  const { branchId } = useParams<{ branchId: string }>();

  if (!team) throw new Error("useBranch must be used under BranchProvider");
  if (!branchId)
    throw new Error(
      "usseBranch must be used under the branches/[branchId] route segment",
    );

  return team;
};

const BRANCH_COOKIE_NAME = "branch";
const BRANCH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function BranchProvider({
  children,
  branchId,
  defaultBranchCookie,
  currentSemesterMode,
}: {
  children: React.ReactNode;
  branchId: string;
  // Pass it from the server component
  defaultBranchCookie?: Record<
    string /** branchId */,
    number /** activeSemester */
  >;
  currentSemesterMode: SemesterMode;
}) {
  const [branch, setBranch] = React.useState<
    Record<string, number> | undefined
  >(defaultBranchCookie);

  const getActiveSemester = React.useCallback(() => {
    if (branch) {
      const _activeSemester = branch[branchId];
      if (_activeSemester) return _activeSemester;
    }
    return currentSemesterMode === "odd" ? 1 : 2;
  }, [branchId, branch, currentSemesterMode]);

  const setActiveSemester = React.useCallback(
    (value: number) => {
      setBranch((prev) => ({ ...prev, [branchId]: value }));
    },
    [branchId],
  );

  React.useEffect(() => {
    // Store each branches state of active semester value in cookie
    document.cookie = `${BRANCH_COOKIE_NAME}=${JSON.stringify(branch)}; path=/; max-age=${BRANCH_COOKIE_MAX_AGE}`;
  }, [branch]);

  return (
    <BranchContext.Provider
      value={{ activeSemester: getActiveSemester(), setActiveSemester }}
    >
      {children}
    </BranchContext.Provider>
  );
}
