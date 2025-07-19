"use client";

import React from "react";
import { format } from "date-fns";

import { resizeSlot } from "./lib/utils";
import { mockTimetableData } from "./mocks/timetable-data";
import { ReactTimetableSlot } from "./react-timetable-slot";

export interface TimetableData {
  _id: string;
  startOfPeriod: number;
  endOfPeriod: number;
  dayOfWeek: number;
  subject: string;
}

/** Utility to get weekday name from index */
function getWeekdayName(dayIndex: number) {
  const baseDate = new Date(2025, 5, 15 + dayIndex);
  return format(baseDate, "EEEE");
}

/** Day indices representing Monday to Saturday */
const daysIndex = [1, 2, 3, 4, 5, 6];

interface ReactTimetableProps {
  numberOfHours?: number;
}

export function ReactTimetable({ numberOfHours = 7 }: ReactTimetableProps) {
  const [slots, setSlots] = React.useState<TimetableData[]>(mockTimetableData);

  const handleResize = (
    _id: string,
    delta: number,
    direction: "left" | "right",
  ) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot._id === _id
          ? resizeSlot(slot, delta, direction, numberOfHours)
          : slot,
      ),
    );
  };

  return (
    <React.Fragment>
      <pre>{JSON.stringify(slots, undefined, 2)}</pre>
      <div
        style={{
          gridTemplateColumns: `repeat(${numberOfHours + 1}, minmax(0, 1fr))`,
        }}
        className={"grid gap-0 overflow-hidden rounded-lg border"}
      >
        <div className="bg-accent col-span-1 h-12 border" />
        {Array.from({ length: numberOfHours }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="bg-accent/20 col-span-1 flex h-12 items-center justify-center border"
          >
            H{i + 1}
          </div>
        ))}

        {daysIndex.map((dayIdx) => (
          <React.Fragment key={`day-${dayIdx}`}>
            <div className="bg-accent/20 text-accent-foreground/40 flex h-24 items-center border-r border-b p-6 text-xl font-medium first:border-b-3">
              {getWeekdayName(dayIdx)}
            </div>

            <div
              className="border-b-border/50 relative grid h-24 grid-flow-row gap-2 border-b px-2 py-2 align-middle last:border-b-0"
              style={{
                gridColumn: `span ${numberOfHours}/span ${numberOfHours}`,
                gridTemplateColumns: `repeat(${numberOfHours}, minmax(0, 1fr))`,
              }}
            >
              {slots
                .filter((s) => s.dayOfWeek === dayIdx)
                .map((slot) => (
                  <ReactTimetableSlot
                    onResize={handleResize}
                    slot={slot}
                    key={slot._id}
                  />
                ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
}
