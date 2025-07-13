"use client";

import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";

interface SemesterSwitcherProps {
  semesters: number[];
}

export function SemesterSwitcher(props: SemesterSwitcherProps) {
  return (
    <Tabs defaultValue="1">
      <TabsList className="h-9 bg-transparent">
        {props.semesters.map((semester, i) => (
          <TabsTrigger className="text-xs" key={i} value={`${semester}`}>
            SEM {semester}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
