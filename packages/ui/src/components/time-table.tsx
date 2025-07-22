"use client";

import React, { useEffect, useLayoutEffect } from "react";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { useDrag } from "@use-gesture/react";
import { format } from "date-fns";
import { motion, useMotionValue, useSpring } from "motion/react";

import { cn } from "../lib/utils";

interface Slot {
  id: string;
  dayOfWeek: number;
  startOfPeriod: number;
  endOfPeriod: number;
  subject: string;
}

interface TimeTableContextValue {
  /** Total hour of classes for the day
   * @default 7
   */
  numberOfHours: number;
  /** Actual slots of timetable
   * @default []
   */
  slots: Slot[];
  /** Toggle between editale and read mode
   * @default false
   */
  editable: boolean;
  onChangeSlots: (slots: Slot[]) => void;
  defaultSlotWidth?: number;
}

const TimeTableContext = React.createContext<TimeTableContextValue | null>(
  null,
);

function useTimeTable() {
  const ctx = React.useContext(TimeTableContext);

  if (!ctx)
    throw new Error("useTimeTable must be used within <TimeTableProvider />");

  const { slots } = ctx;

  /** Get all slots by dayIdx */
  function getSlotsByDayIdx(dayIdx: number) {
    return slots.filter((s) => s.dayOfWeek === dayIdx);
  }

  /** Update day slot */
  function updateDaySlot(slot: Slot) {
    ctx?.onChangeSlots([...slots.filter((s) => s.id !== slot.id), slot]);
  }

  return { ...ctx, getSlotsByDayIdx, updateDaySlot };
}

/** Utility to get weekday name from index */
function getWeekdayName(dayIndex: number) {
  const baseDate = new Date(2025, 5, 15 + dayIndex);
  return format(baseDate, "EEEE");
}

/** Day indices representing Monday to Saturday */
const daysIndex = [1, 2, 3, 4, 5, 6];

type TimeTableProps = Partial<TimeTableContextValue>;

export function TimeTable({
  editable = false,
  numberOfHours = 7,
  slots = [],
  onChangeSlots = function () {
    return;
  },
}: TimeTableProps) {
  const [defaultSlotWidth, setDefaultSlotWidth] = React.useState<
    number | undefined
  >(undefined);
  const hourSlotRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) {
        setDefaultSlotWidth(entry.contentRect.width);
      }
    });

    if (hourSlotRef.current) {
      observer.observe(hourSlotRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      editable,
      numberOfHours,
      slots,
      onChangeSlots,
      defaultSlotWidth,
    }),
    [editable, numberOfHours, slots, onChangeSlots, defaultSlotWidth],
  );

  return (
    <TimeTableContext.Provider value={contextValue}>
      <div>
        {/* HOURS */}
        <TimeTableGridRow>
          <div className="bg-accent col-span-1 h-12 border-r" />
          {Array.from({ length: numberOfHours }).map((_, i) => (
            <div
              key={`h-${i}`}
              ref={i === 0 ? hourSlotRef : null}
              className="bg-accent/20 col-span-1 flex h-12 items-center justify-center border-r"
            >
              H{i + 1}
            </div>
          ))}
        </TimeTableGridRow>

        {/* DAYS */}
        {daysIndex.map((dayIdx) => (
          <TimeTableGridRow key={dayIdx}>
            <div className="bg-accent/20 text-accent-foreground/40 col-span-1 flex h-24 items-center border-r p-6 text-xl font-medium">
              {getWeekdayName(dayIdx)}
            </div>
            <TimeTableDayRow dayIdx={dayIdx} />
          </TimeTableGridRow>
        ))}
      </div>
    </TimeTableContext.Provider>
  );
}

function TimeTableDayRow({
  dayIdx,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  dayIdx: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { numberOfHours, defaultSlotWidth, getSlotsByDayIdx } = useTimeTable();
  const daySlots = getSlotsByDayIdx(dayIdx);

  return (
    <div
      ref={containerRef}
      className={cn(`bg-accent/40 p-1`, className)}
      style={{ gridColumn: `span ${numberOfHours}/ span ${numberOfHours}` }}
      {...props}
    >
      {daySlots.map((slot) => {
        if (!defaultSlotWidth) return null;
        return (
          <TimeTableSlot
            key={slot.id}
            defaultSlotWidth={defaultSlotWidth}
            containerRef={containerRef}
            slot={slot}
          />
        );
      })}
    </div>
  );
}

function TimeTableSlot({
  containerRef,
  slot,
  defaultSlotWidth,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  slot: Slot;
  defaultSlotWidth: number;
}) {
  const { editable, updateDaySlot, numberOfHours } = useTimeTable();

  const initialWidth =
    (slot.endOfPeriod - slot.startOfPeriod + 1) * defaultSlotWidth;
  const initialX = (slot.startOfPeriod - 1) * defaultSlotWidth;

  const x = useMotionValue(initialWidth);
  const width = useMotionValue(initialWidth);

  useLayoutEffect(() => {
    x.set(initialX);
    width.set(initialWidth);
  }, [width, x, initialX, initialWidth]);

  const springX = useSpring(x, {
    duration: 0.005,
    mass: 0.5,
  });
  const springWidth = useSpring(width, {
    duration: 0.005,
    mass: 0.5,
  });

  // Resizing from the right
  const bindRightResize = useDrag(
    ({ movement: [dx], velocity: [vx], last }) => {
      const newWidth = initialWidth + dx + vx;
      const snappedColumn = Math.min(
        numberOfHours,
        Math.max(1, Math.floor(newWidth / defaultSlotWidth)),
      );
      const snappedWidth = Math.max(
        defaultSlotWidth,
        snappedColumn * defaultSlotWidth,
      );

      width.set(snappedWidth);

      if (last) {
        updateDaySlot({ ...slot, endOfPeriod: snappedColumn });
      }
    },
    { filterTaps: true },
  );

  // Resizing from the left
  const bindLeftResize = useDrag(
    ({ movement: [dx], last }) => {
      const newX = initialX + dx;

      const snappedStartColumn = Math.max(
        1,
        Math.floor(newX / defaultSlotWidth),
      );
      const snappedX = snappedStartColumn * defaultSlotWidth;

      const snappedWidth =
        (slot.endOfPeriod - snappedStartColumn) * defaultSlotWidth;

      if (newX >= 0 && snappedWidth >= defaultSlotWidth) {
        x.set(newX);
        width.set(snappedWidth);
      }

      if (last) {
        // Prevent dragging beyond bounds or shrinking too small
        if (snappedX >= 0 && snappedWidth >= defaultSlotWidth) {
          x.set(snappedX);
          width.set(snappedWidth);
        }

        updateDaySlot({
          ...slot,
          startOfPeriod: snappedStartColumn,
        });
      }
    },
    { filterTaps: true },
  );

  return (
    <motion.div
      className="bg-accent/50 relative z-50 flex h-full overflow-hidden rounded-md border backdrop-blur-lg transition-all duration-75 hover:cursor-grab active:cursor-grabbing"
      dragConstraints={containerRef}
      style={{ x: springX, width: springWidth }}
    >
      {/* LEFT HANDLE */}
      <div
        {...bindLeftResize()}
        className={cn(
          "bg-accent/60 hover:bg-accent/80 active:bg-muted absolute top-0 left-0 z-10 flex h-full w-2 touch-none items-center justify-center hover:cursor-ew-resize",
          !editable && "hidden",
        )}
      >
        <DotsSixVerticalIcon weight="duotone" className="size-full" />
      </div>
      <div className="w-full p-4 text-sm">{slot.subject}</div>
      {/* RIGHT HANDLE */}
      <div
        {...bindRightResize()}
        className={cn(
          "bg-accent/60 hover:bg-accent/80 active:bg-muted absolute top-0 right-0 z-10 flex h-full w-2 touch-none items-center justify-center hover:cursor-ew-resize",
          !editable && "hidden",
        )}
      >
        <DotsSixVerticalIcon weight="duotone" className="size-full" />
      </div>
    </motion.div>
  );
}

/** Grid row defines columns based on given number of hours */
function TimeTableGridRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { numberOfHours } = useTimeTable();

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${numberOfHours + 1}, minmax(0, 1fr))`,
      }}
      className={cn("grid gap-0 overflow-hidden border", className)}
      {...props}
    />
  );
}
