"use client";

import React, { useState } from "react";
import { cn } from "@instello/ui/lib/utils";
import { createId } from "@paralleldrive/cuid2";
import { format } from "date-fns";

import type { ReactTimetableContextProps } from "./context";
import { ReactTimetableContext } from "./context";
import { ReactTimetableSlot } from "./react-timetable-slot";
import { SubjectPopover } from "./subject-popover";
import { resizeSlot } from "./utils";

export interface TimetableData {
  _id: string;
  startOfPeriod: number;
  endOfPeriod: number;
  dayOfWeek: number;
  subjectId: string;
  subjectName: string;
}

export type TimetableInput = Omit<TimetableData, "_id">;

/** Utility to get weekday name from index */
function getWeekdayName(dayIndex: number) {
  const baseDate = new Date(2025, 5, 15 + dayIndex);
  return format(baseDate, "EEEE");
}

/** Day indices representing Monday to Saturday */
const daysIndex = [1, 2, 3, 4, 5, 6];

interface ReactTimetableProps
  extends Omit<
    ReactTimetableContextProps,
    "timetableSlots" | "addSlot" | "removeSlot"
  > {
  numberOfHours?: number;
  timetableSlots: TimetableInput[];
  onDataChange?: (data: TimetableData[]) => void;
}

export interface PopoverState {
  dayIdx: number;
  period: number;
  position: { x: number; y: number };
}

export function ReactTimetable({
  numberOfHours = 7,
  editable = false,
  timetableSlots = [],
  onDataChange,
}: ReactTimetableProps) {
  const inputSlots = timetableSlots.map((s) => ({ ...s, _id: createId() }));
  const [slots, setSlots] = React.useState<TimetableData[]>(inputSlots);
  const [popoverState, setPopoverState] = useState<PopoverState | null>(null);

  const handleEmptyClick = (
    dayIdx: number,
    period: number,
    e: React.MouseEvent,
  ) => {
    setPopoverState({
      dayIdx,
      period,
      position: { x: e.clientX, y: e.clientY },
    });
  };

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

  const addSlot = React.useCallback((data: Omit<TimetableData, "_id">) => {
    setSlots((prev) => [...prev, { ...data, _id: createId() }]);
  }, []);

  const removeSlot = React.useCallback((_id: string) => {
    setSlots((prev) => prev.filter((s) => s._id === _id));
  }, []);

  React.useEffect(() => {
    onDataChange?.(slots);
  }, [slots, onDataChange]);

  return (
    <ReactTimetableContext.Provider
      value={{ editable, addSlot, removeSlot, timetableSlots: slots }}
    >
      {/* <pre>{JSON.stringify(slots, undefined, 2)}</pre> */}
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
              <div
                data-row={"empty-slot-row"}
                className="absolute z-10 col-span-full h-full w-full"
              >
                {/* Empty Clickable Cells */}
                {Array.from({ length: numberOfHours }).map((_, i) => {
                  const occupied = slots.find(
                    (slot) =>
                      slot.dayOfWeek === dayIdx &&
                      i + 1 >= slot.startOfPeriod &&
                      i + 1 <= slot.endOfPeriod, // <-- fixed condition
                  );

                  const left = `${(i / numberOfHours) * 100}%`;
                  const width = `${100 / numberOfHours}%`;

                  return (
                    <div
                      data-slot="empty"
                      key={`empty-${dayIdx}-${i}`}
                      className={cn(
                        "hover:bg-muted bg-muted/10 absolute top-0 bottom-0 cursor-pointer transition-colors",
                        occupied &&
                          "pointer-events-none h-0 opacity-0 hover:bg-transparent",
                        !editable && "hover:bg-muted/10 hover:cursor-auto",
                      )}
                      style={{
                        left,
                        width,
                      }}
                      onClick={(e) => {
                        if (!occupied) handleEmptyClick(dayIdx, i + 1, e);
                      }}
                    />
                  );
                })}
              </div>

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

      {/** Popover for subjects list only in editable mode */}
      {popoverState && editable && (
        <SubjectPopover
          {...popoverState}
          onOpenChange={() => setPopoverState(null)}
        />
      )}
    </ReactTimetableContext.Provider>
  );
}
