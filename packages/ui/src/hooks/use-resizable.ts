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
    (dx: number) => {
      const snapCols = Math.round(dx / defaultSlotWidth);
      const newStart = Math.min(
        Math.max(1, startRef.current + snapCols),
        endRef.current - 1,
      );

      // update x and width
      const newX = (newStart - 1) * defaultSlotWidth;
      const newWidth = (endRef.current - newStart + 1) * defaultSlotWidth;

      x.set(newX);
      width.set(newWidth);

      onResize({ startOfPeriod: newStart, endOfPeriod: endRef.current });
    },
    [onResize, defaultSlotWidth, x, width],
  );

  const updateEnd = useCallback(
    (dx: number) => {
      const snapCols = Math.round(dx / defaultSlotWidth);
      const newEnd = Math.max(
        Math.min(totalColumns, endRef.current + snapCols),
        startRef.current + 1,
      );

      // update width only
      const newWidth = (newEnd - startRef.current + 1) * defaultSlotWidth;

      width.set(newWidth);

      onResize({ startOfPeriod: startRef.current, endOfPeriod: newEnd });
    },
    [onResize, defaultSlotWidth, totalColumns, width],
  );

  const bindLeftResize = useDrag(
    ({ movement: [dx], first }) => {
      if (first) startRef.current = slot.startOfPeriod;
      updateStart(dx);
    },
    { axis: "x", pointer: { touch: true } },
  );

  const bindRightResize = useDrag(
    ({ movement: [dx], first }) => {
      if (first) endRef.current = slot.endOfPeriod;
      updateEnd(dx);
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
