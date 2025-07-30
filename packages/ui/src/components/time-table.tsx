"use client";

import React from "react";
import { DotsSixVerticalIcon, XIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { AnimatePresence, motion, useSpring } from "motion/react";

import { useResizableSlot } from "../hooks/use-resizable-slot";
import { cn } from "../lib/utils";
import { Button } from "./button";

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

  /** triggers, When user click's on the empty area AKA where no slot's placed then this component will be placed over there */
  EmptySlotPopoverComponent?: (params: {
    slotInfo: Omit<Slot, "subject">;
    position: { x: number; y: number };
    actions: {
      addSlot: (slot: Slot) => void;
    };
    close: () => void;
  }) => React.ReactNode;

  /** Custom slot render */
  slotRender?: (
    slot: Slot,
    actions: { updateSlot: () => void },
  ) => React.ReactNode;
}

const TimeTableContext = React.createContext<TimeTableContextValue | null>(
  null,
);

function useTimeTable() {
  const ctx = React.useContext(TimeTableContext);

  if (!ctx)
    throw new Error("useTimeTable must be used within <TimeTableProvider />");

  const { slots, numberOfHours } = ctx;

  /** Get all slots by dayIdx */
  function getSlotsByDayIdx(dayIdx: number) {
    return slots.filter((s) => s.dayOfWeek === dayIdx);
  }

  /** Update day slot */
  function updateDaySlot(slot: Slot) {
    ctx?.onChangeSlots([...slots.filter((s) => s.id !== slot.id), slot]);
  }

  /** Delete slot by Id */
  function deleteSlot(slotId: string) {
    ctx?.onChangeSlots([...slots.filter((s) => s.id !== slotId)]);
  }

  function getSlotResizeBounds(currentSlot: Slot) {
    const slotsOnSameDay = slots
      .filter(
        (s) => s.dayOfWeek === currentSlot.dayOfWeek && s.id !== currentSlot.id,
      )
      .sort((a, b) => a.startOfPeriod - b.startOfPeriod);

    let maxStart = 1;
    let maxEnd = numberOfHours;

    for (const slot of slotsOnSameDay) {
      // Check for left neighbor
      if (slot.endOfPeriod < currentSlot.startOfPeriod) {
        maxStart = Math.max(maxStart, slot.endOfPeriod + 1);
      }

      // Check for right neighbor
      if (slot.startOfPeriod > currentSlot.endOfPeriod) {
        maxEnd = Math.min(maxEnd, slot.startOfPeriod - 1);
        break; // Since sorted, no need to check further
      }
    }

    return {
      maxStartPeriod: maxStart,
      maxEndPeriod: maxEnd,
    };
  }

  return {
    ...ctx,
    getSlotsByDayIdx,
    updateDaySlot,
    getSlotResizeBounds,
    deleteSlot,
  };
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
  onChangeSlots = () => {
    return;
  },
  EmptySlotPopoverComponent,
  slotRender,
}: TimeTableProps) {
  const [defaultSlotWidth, setDefaultSlotWidth] = React.useState<
    number | undefined
  >(undefined);
  const hourSlotRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
      EmptySlotPopoverComponent,
      slotRender,
    }),
    [
      editable,
      numberOfHours,
      slots,
      onChangeSlots,
      defaultSlotWidth,
      EmptySlotPopoverComponent,
      slotRender,
    ],
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
  const {
    slots,
    numberOfHours,
    defaultSlotWidth,
    editable,
    getSlotsByDayIdx,
    EmptySlotPopoverComponent,
    onChangeSlots,
  } = useTimeTable();
  const daySlots = getSlotsByDayIdx(dayIdx);

  const [popoverState, setPopoverState] = React.useState<{
    position: { x: number; y: number };
    slotInfo: Omit<Slot, "subject">;
  } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable || !defaultSlotWidth || !EmptySlotPopoverComponent) return;

    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = e.clientX - bounds.left;
    const hourIndex = Math.max(
      Math.min(Math.floor(x / defaultSlotWidth) + 1, numberOfHours),
      1,
    );

    const isOccupied = daySlots.some(
      (s) => hourIndex >= s.startOfPeriod && hourIndex <= s.endOfPeriod,
    );

    if (isOccupied) {
      setPopoverState(null);
      return;
    }

    setPopoverState({
      position: { x: e.clientX, y: e.clientY },
      slotInfo: {
        id: crypto.randomUUID(),
        dayOfWeek: dayIdx,
        startOfPeriod: hourIndex,
        endOfPeriod: hourIndex,
      },
    });
  };

  const handleClose = () => setPopoverState(null);

  return (
    <>
      {popoverState &&
        EmptySlotPopoverComponent?.({
          ...popoverState,
          actions: {
            addSlot: (slot) => {
              onChangeSlots([...slots, slot]);
              handleClose();
            },
          },
          close: handleClose,
        })}
      <div
        ref={containerRef}
        className={cn(
          `relative`,
          editable && "bg-accent/20 pattern-polka",
          className,
        )}
        onClick={handleClick}
        style={{
          gridColumn: `span ${numberOfHours}/ span ${numberOfHours}`,
        }}
        {...props}
      >
        <AnimatePresence>
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
        </AnimatePresence>
      </div>
    </>
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
  const {
    editable,
    updateDaySlot,
    deleteSlot,
    numberOfHours,
    getSlotResizeBounds,
    slotRender,
  } = useTimeTable();

  const { maxEndPeriod, maxStartPeriod } = getSlotResizeBounds(slot);

  const { bindLeftResize, bindRightResize, motionProps } = useResizableSlot({
    totalColumns: numberOfHours,
    slot,
    defaultSlotWidth,
    onResize: (updatedPeriods) => updateDaySlot({ ...slot, ...updatedPeriods }),
    containerRef,
    maxEndPeriod,
    maxStartPeriod,
  });

  const xWithSpring = useSpring(motionProps.style.x, {
    stiffness: 400,
    damping: 30,
  });
  const widthWithSpring = useSpring(motionProps.style.width, {
    stiffness: 400,
    damping: 30,
  });

  return (
    <motion.div
      initial={editable ? { opacity: 0, scale: 0.95, y: 10 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className="bg-accent absolute top-1 bottom-1 flex overflow-hidden rounded-md border backdrop-blur-lg transition-all duration-75"
      dragConstraints={containerRef}
      style={{
        x: xWithSpring,
        width: widthWithSpring,
        height: `calc(calc(var(--spacing)*22)`,
      }}
    >
      {/* LEFT HANDLE */}
      <div
        {...bindLeftResize()}
        className={cn(
          "bg-accent/60 hover:bg-accent/80 active:bg-primary/20 relative top-0 left-0 z-10 flex h-full w-2.5 touch-none items-center justify-center hover:cursor-ew-resize",
          !editable && "hidden",
        )}
      >
        <DotsSixVerticalIcon weight="duotone" className="size-full" />
      </div>

      {/* SLOT RENDERER */}
      {slotRender ? (
        slotRender(slot, {
          updateSlot: () => {
            console.log("updating");
          },
        })
      ) : (
        <div className="w-full p-4 text-sm">{slot.subject}</div>
      )}

      <Button
        title="Delete Slot"
        onClick={() => deleteSlot(slot.id)}
        variant={"ghost"}
        disabled={!editable}
        size={"icon"}
        className={cn(
          "text-destructive hover:text-destructive hover:bg-destructive/10 relative top-2 right-2 size-5 [&>svg]:!size-3.5",
          !editable && "hidden",
        )}
      >
        <XIcon weight="bold" />
      </Button>
      {/* RIGHT HANDLE */}
      <div
        {...bindRightResize()}
        className={cn(
          "bg-accent/60 hover:bg-accent/80 active:bg-primary/20 relative top-0 right-0 z-10 flex h-full w-2.5 touch-none items-center justify-center hover:cursor-ew-resize",
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
