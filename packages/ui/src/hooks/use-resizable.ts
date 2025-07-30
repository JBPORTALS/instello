import { useCallback, useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { useMotionValue } from "framer-motion";

interface UseResizableSlotParams {
  slot: {
    startOfPeriod: number;
    endOfPeriod: number;
    dayOfWeek: number;
  };
  onResize: (updated: { startOfPeriod: number; endOfPeriod: number }) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalColumns: number;
  defaultSlotWidth: number;
}

export function useResizableSlot({
  slot,
  onResize,
  totalColumns,
  defaultSlotWidth,
}: UseResizableSlotParams) {
  const x = useMotionValue((slot.startOfPeriod - 1) * defaultSlotWidth);
  const width = useMotionValue(
    (slot.endOfPeriod - slot.startOfPeriod + 1) * defaultSlotWidth,
  );

  const startRef = useRef(slot.startOfPeriod);
  const endRef = useRef(slot.endOfPeriod);

  useEffect(() => {
    x.set((slot.startOfPeriod - 1) * defaultSlotWidth);
    width.set((slot.endOfPeriod - slot.startOfPeriod + 1) * defaultSlotWidth);
  }, [slot, defaultSlotWidth, width, x]);

  const updateStart = useCallback(
    (mx: number, last: boolean) => {
      const snapCols = Math.round(mx / defaultSlotWidth);

      /**
       * Get new start by adding snapped column to current start period value.
       * @max one slot should have start period equals to end period
       * @min one slot can have start period value to be equal to 1
       */
      const newStart = Math.min(
        Math.max(1, startRef.current + snapCols),
        endRef.current,
      );

      // update x and width
      const newX = (newStart - 1) * defaultSlotWidth;
      const newWidth = (endRef.current - newStart + 1) * defaultSlotWidth;

      x.set(newX);
      width.set(newWidth);

      if (last)
        onResize({ startOfPeriod: newStart, endOfPeriod: endRef.current });
    },
    [onResize, defaultSlotWidth, x, width],
  );

  const updateEnd = useCallback(
    (mx: number, last: boolean) => {
      const snapCols = Math.round(mx / defaultSlotWidth);

      /**
       * Get new end by increasing the current end slot by adding snapped column value.
       * @max one slot should have end slot value to be total columns value
       * @min one slot can have only one period where it's initially starting
       */
      const newEnd = Math.max(
        Math.min(totalColumns, endRef.current + snapCols),
        startRef.current,
      );

      // update width only
      const newWidth = (newEnd - startRef.current + 1) * defaultSlotWidth;

      width.set(newWidth);

      if (last)
        onResize({ startOfPeriod: startRef.current, endOfPeriod: newEnd });
    },
    [onResize, defaultSlotWidth, totalColumns, width],
  );

  const bindLeftResize = useDrag(
    ({ movement: [mx], first, last }) => {
      if (first) {
        startRef.current = slot.startOfPeriod;
        endRef.current = slot.endOfPeriod;
      }
      updateStart(mx, last);
    },
    { axis: "x", pointer: { touch: true } },
  );

  const bindRightResize = useDrag(
    ({ movement: [mx], first, last }) => {
      if (first) {
        startRef.current = slot.startOfPeriod;
        endRef.current = slot.endOfPeriod;
      }
      updateEnd(mx, last);
    },
    { axis: "x", pointer: { touch: true } },
  );

  console.log(x.get(), width.get());

  return {
    motionProps: {
      style: {
        x,
        width,
      },
    },
    bindLeftResize,
    bindRightResize,
  };
}
