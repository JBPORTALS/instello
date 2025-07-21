"use client";

import React from "react";
import { format } from "date-fns";
import { motion } from "motion/react";

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

  return { ...ctx, getSlotsByDayIdx };
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
  const contextValue = React.useMemo(
    () => ({
      editable,
      numberOfHours,
      slots,
      onChangeSlots,
    }),
    [editable, numberOfHours, slots, onChangeSlots],
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
            <TimeTableDayRow numberOfHours={numberOfHours} dayIdx={dayIdx} />
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
  numberOfHours: number;
  dayIdx: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { numberOfHours, getSlotsByDayIdx } = useTimeTable();
  const daySlots = getSlotsByDayIdx(dayIdx);

  console.log(daySlots);

  return (
    <div
      ref={containerRef}
      className={cn(`col-span-[${numberOfHours}] bg-accent/40 p-1`, className)}
      {...props}
    >
      {daySlots.map((slot) => (
        <TimeTableSlot key={slot.id} containerRef={containerRef} slot={slot} />
      ))}
    </div>
  );
}

function TimeTableSlot({
  containerRef,
  slot,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  slot: Slot;
}) {
  return (
    <motion.div
      className="bg-accent h-full rounded-md p-4"
      dragConstraints={containerRef}
    >
      {slot.subject}
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
