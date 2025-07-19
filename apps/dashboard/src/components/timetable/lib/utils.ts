import type { TimetableData } from "@/components/timetable";

export function resizeSlot(
  slot: TimetableData,
  delta: number,
  direction: "left" | "right",
  numberOfHours: number,
): TimetableData {
  let newStart = slot.startOfPeriod;
  let newEnd = slot.endOfPeriod;

  if (direction === "left") {
    newStart += delta;
    if (newStart < 1) newStart = 1;
    if (newStart > newEnd) newStart = Math.min(newEnd, newStart);
  } else {
    newEnd += delta;
    if (newEnd < newStart) newEnd = newStart;
    if (newEnd > numberOfHours) newEnd = numberOfHours;
  }

  return {
    ...slot,
    startOfPeriod: newStart,
    endOfPeriod: newEnd,
  };
}
