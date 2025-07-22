import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { useDrag } from "@use-gesture/react";

interface UseResizableSlotProps {
  x: MotionValue<number>;
  width: MotionValue<number>;
  slot: {
    startOfPeriod: number;
    endOfPeriod: number;
  };
  defaultSlotWidth: number;
  numberOfHours: number;
  onResizeEnd: (updatedPeriods: {
    startOfPeriod: number;
    endOfPeriod: number;
  }) => void;
}

export function useResizableSlot({
  x,
  width,
  slot,
  defaultSlotWidth,
  numberOfHours,
  onResizeEnd,
}: UseResizableSlotProps) {
  const initialXRef = useRef(0);
  const initialWidthRef = useRef(0);

  const bindLeftResize = useDrag(
    ({ movement: [dx], first, last }) => {
      if (first) {
        initialXRef.current = (slot.startOfPeriod - 1) * defaultSlotWidth;
        initialWidthRef.current =
          (slot.endOfPeriod - slot.startOfPeriod + 1) * defaultSlotWidth;
      }

      const initialX = initialXRef.current;
      const newX = initialX + dx;

      const snappedStart = Math.max(
        1,
        Math.min(
          slot.endOfPeriod,
          Math.round((newX - defaultSlotWidth / 2) / defaultSlotWidth),
        ),
      );

      const columnsSpanned = slot.endOfPeriod - snappedStart + 1;
      const snappedX = (snappedStart - 1) * defaultSlotWidth;
      const snappedWidth = columnsSpanned * defaultSlotWidth;

      x.set(snappedX);
      width.set(snappedWidth);

      if (last) {
        onResizeEnd({
          ...slot,
          startOfPeriod: snappedStart,
        });
      }
    },
    { filterTaps: true },
  );

  const bindRightResize = useDrag(
    ({ movement: [dx], first, last }) => {
      if (first) {
        initialWidthRef.current =
          (slot.endOfPeriod - slot.startOfPeriod + 1) * defaultSlotWidth;
      }

      const initialWidth = initialWidthRef.current;
      const newWidth = initialWidth + dx;

      const snappedColumns = Math.max(
        1,
        Math.min(
          numberOfHours - slot.startOfPeriod + 1,
          Math.round((newWidth + defaultSlotWidth / 2) / defaultSlotWidth),
        ),
      );

      const snappedWidth = snappedColumns * defaultSlotWidth;

      width.set(snappedWidth);

      if (last) {
        const newEnd = slot.startOfPeriod + snappedColumns - 1;
        onResizeEnd({
          ...slot,
          endOfPeriod: newEnd,
        });
      }
    },
    { filterTaps: true },
  );

  return {
    bindLeftResize,
    bindRightResize,
  };
}
