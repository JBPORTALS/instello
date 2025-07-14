"use client";

import { useBranch } from "@/context/branch/client";
import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";

interface SemesterSwitcherProps {
  semesters: number[];
}

export function SemesterSwitcher(props: SemesterSwitcherProps) {
  const { activeSemester, setActiveSemester } = useBranch();

  return (
    <Tabs defaultValue={activeSemester.toString()}>
      <TabsList className="h-9 bg-transparent">
        {props.semesters.map((semester, i) => (
          <TabsTrigger
            onClick={() => setActiveSemester(semester)}
            className="text-xs"
            key={i}
            value={`${semester}`}
          >
            SEM {semester}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
