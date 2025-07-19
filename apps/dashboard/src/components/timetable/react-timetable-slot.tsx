import React, { useLayoutEffect } from "react";
import { cn } from "@instello/ui/lib/utils";
import { IconGripVertical } from "@tabler/icons-react";
import { useDrag } from "@use-gesture/react";

import type { TimetableData } from ".";
import { useReactTimetable } from "./context";

interface ReactTimetableSlotProps {
  slot: TimetableData;
  onResize: (_id: string, delta: number, direction: "left" | "right") => void;
  numberOfHours?: number;
}

export function ReactTimetableSlot({
  slot,
  onResize,
  numberOfHours = 7,
}: ReactTimetableSlotProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hourWidth, setHourWidth] = React.useState(100); // default
  const [dragOffset, setDragOffset] = React.useState(0); // px during drag
  const [dragDir, setDragDir] = React.useState<"left" | "right" | null>(null);
  const { editable } = useReactTimetable();

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
    { axis: "x", filterTaps: true, enabled: editable },
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
    { axis: "x", filterTaps: true, enabled: editable },
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
        "bg-accent/50 relative z-50 flex h-20 overflow-hidden rounded-md border backdrop-blur-lg transition-all duration-75",
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
        className={cn(
          "bg-accent/60 hover:bg-accent/80 active:bg-muted absolute top-0 left-0 z-10 flex h-full w-2 touch-none items-center justify-center hover:cursor-ew-resize",
          !editable && "hidden",
        )}
      >
        <IconGripVertical className="size-full" />
      </button>

      <div className="w-full p-2.5 text-xs">{slot.subjectName}</div>

      {/* RIGHT HANDLE */}
      <button
        {...bindRight()}
        className={cn(
          "bg-accent/60 hover:bg-accent/80 active:bg-muted absolute top-0 right-0 z-10 flex h-full w-2 touch-none items-center justify-center hover:cursor-ew-resize",
          !editable && "hidden",
        )}
      >
        <IconGripVertical className="size-full" />
      </button>
    </div>
  );
}
