"use client";

import React, { useLayoutEffect } from "react";
import { cn } from "@instello/ui/lib/utils";
import { IconGripVertical } from "@tabler/icons-react";
import { useDrag } from "@use-gesture/react";
import { format } from "date-fns";

export interface TimetableData {
  _id: string;
  startOfPeriod: number;
  endOfPeriod: number;
  dayOfWeek: number;
  subject: string;
}

const data: TimetableData[] = [
  {
    _id: "839292",
    startOfPeriod: 1,
    endOfPeriod: 2,
    dayOfWeek: 1,
    subject: "Mathemetics",
  },
  {
    _id: "839282",
    startOfPeriod: 2,
    endOfPeriod: 2,
    dayOfWeek: 2,
    subject: "Science",
  },
  {
    _id: "8399092",
    startOfPeriod: 6,
    endOfPeriod: 7,
    dayOfWeek: 1,
    subject: "Biology",
  },
];

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
  const [slots, setSlots] = React.useState<TimetableData[]>(data);

  const handleResize = (
    _id: string,
    delta: number,
    direction: "left" | "right",
  ) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s._id !== _id) return s;

        let newStart = s.startOfPeriod;
        let newEnd = s.endOfPeriod;

        if (direction === "left") {
          newStart = s.startOfPeriod + delta;

          /**
           * If new startOfPerios becomes less than 1 bring back to initial period 1
           */
          if (newStart < 1) newStart = 1;

          /**
           * New start is less than endOfPeriod of slot,
           * then calculate the startOfPeriod based on delta direction
           */
          if (newStart <= s.endOfPeriod)
            newStart = Math.min(newEnd + 1, newStart);
        } else {
          /**
           * When direction of handle is right, always pick the maxium value of end
           */
          newEnd = Math.max(newStart, s.endOfPeriod + delta);
        }

        return {
          ...s,
          startOfPeriod: newStart,
          endOfPeriod: newEnd,
        };
      }),
    );
  };

  function getSnapLimits(slotId: string): { left: number; right: number } {
    const current = slots.find((s) => s._id === slotId);
    const siblings = slots.filter((s) => s._id !== slotId);

    if (!current) throw new Error("No solt found");

    const maxLeft = 1;
    const maxRight = numberOfHours;

    const nearestLeft = siblings
      .filter((s) => s.endOfPeriod < current.startOfPeriod)
      .sort((a, b) => b.endOfPeriod - a.endOfPeriod)[0];

    const nearestRight = siblings
      .filter((s) => s.startOfPeriod > current.endOfPeriod)
      .sort((a, b) => a.startOfPeriod - b.startOfPeriod)[0];

    const leftLimit = nearestLeft
      ? current.startOfPeriod - nearestLeft.endOfPeriod - 1
      : maxLeft;

    const rightLimit = nearestRight
      ? nearestRight.startOfPeriod - current.endOfPeriod - 1
      : maxRight;

    return {
      left: Math.max(0, leftLimit),
      right: Math.max(0, rightLimit),
    };
  }

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
                    getSnapLimits={getSnapLimits}
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

interface ReactTimetableSlotProps {
  slot: TimetableData;
  onResize: (_id: string, delta: number, direction: "left" | "right") => void;
  numberOfHours?: number;
  getSnapLimits: (slotId: string) => { left: number; right: number };
}

function ReactTimetableSlot({
  slot,
  onResize,
  numberOfHours = 7,
  getSnapLimits,
}: ReactTimetableSlotProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hourWidth, setHourWidth] = React.useState(100); // default
  const [dragOffset, setDragOffset] = React.useState(0); // px during drag
  const [dragDir, setDragDir] = React.useState<"left" | "right" | null>(null);

  // Dynamically calculate column width
  useLayoutEffect(() => {
    if (!ref.current?.parentElement) return;
    const parent = ref.current.parentElement;
    const width = parent.getBoundingClientRect().width;
    setHourWidth(width / numberOfHours);
  }, [numberOfHours]);

  const bindLeft = useDrag(
    ({ movement: [mx], last }) => {
      setDragDir("left");

      const snappedCols = Math.round(mx / hourWidth);
      const clampedCols = Math.max(-slot.startOfPeriod + 1, snappedCols); // prevent overflow left

      if (last) {
        setDragOffset(0);
        setDragDir(null);
        requestAnimationFrame(() => {
          onResize(slot._id, clampedCols, "left");
        });
      } else {
        setDragOffset(clampedCols * hourWidth); // convert snapped cols back to px for live preview
      }
    },
    { axis: "x", filterTaps: true },
  );

  const bindRight = useDrag(
    ({ movement: [mx], last }) => {
      setDragDir("right");

      const snappedCols = Math.round(mx / hourWidth);
      const maxCols = numberOfHours - slot.endOfPeriod; // how much it can grow
      const clampedCols = Math.max(
        Math.min(snappedCols, maxCols),
        -originalCols + 1,
      ); // prevent shrinking below 1

      if (last) {
        setDragOffset(0);
        setDragDir(null);
        requestAnimationFrame(() => {
          onResize(slot._id, clampedCols, "right");
        });
      } else {
        setDragOffset(clampedCols * hourWidth);
      }
    },
    { axis: "x", filterTaps: true },
  );

  // The number of hours (cols) originally occupied
  const originalCols = slot.endOfPeriod - slot.startOfPeriod + 1;
  const baseWidth = originalCols * hourWidth;

  // Compute width and offset correctly based on drag direction
  let dragWidth = baseWidth;
  let offsetX = 0;

  if (dragDir === "left") {
    dragWidth = baseWidth - dragOffset;
    dragWidth = Math.max(hourWidth, dragWidth);
    offsetX = baseWidth - dragWidth;
  } else if (dragDir === "right") {
    dragWidth = baseWidth + dragOffset;
    dragWidth = Math.max(hourWidth, dragWidth);
    offsetX = 0;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "bg-accent/50 relative flex h-20 overflow-hidden rounded-md border backdrop-blur-lg transition-all duration-75",
        dragDir && "top-2",
      )}
      style={{
        gridColumnStart: slot.startOfPeriod,
        gridColumnEnd: slot.endOfPeriod + 1,
        width: dragDir ? `${dragWidth}px` : "auto",
        transform: dragDir == "left" ? `translateX(${offsetX}px)` : "none",
        position: dragDir ? "absolute" : "relative",
        zIndex: dragDir ? 10 : undefined,
      }}
    >
      {/* LEFT HANDLE */}
      <button
        {...bindLeft()}
        className="bg-accent/60 hover:bg-accent/80 active:bg-muted absolute top-0 left-0 z-10 flex h-full w-2 touch-none items-center justify-center hover:cursor-ew-resize"
      >
        <IconGripVertical className="size-full" />
      </button>

      <div className="w-full p-2.5 text-xs">{slot.subject}</div>

      {/* RIGHT HANDLE */}
      <button
        {...bindRight()}
        className="bg-accent/60 hover:bg-accent/80 active:bg-muted absolute top-0 right-0 z-10 flex h-full w-2 touch-none items-center justify-center hover:cursor-ew-resize"
      >
        <IconGripVertical className="size-full" />
      </button>
    </div>
  );
}
