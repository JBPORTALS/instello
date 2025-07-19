import { resizeSlot } from "@/components/timetable/utils";
import { describe, expect, it } from "vitest";

describe("resizeSlot", () => {
  const baseSlot = {
    _id: "1",
    dayOfWeek: 1,
    subject: "Test",
    startOfPeriod: 2,
    endOfPeriod: 4,
  };

  it("prevents shrinking below 1", () => {
    const res = resizeSlot(baseSlot, -5, "left", 7);
    expect(res.startOfPeriod).toBe(1);
  });

  it("resizes right within max hours", () => {
    const res = resizeSlot(baseSlot, 3, "right", 7);
    expect(res.endOfPeriod).toBe(7);
  });

  it("clamps right resize below start", () => {
    const res = resizeSlot(baseSlot, -10, "right", 7);
    expect(res.endOfPeriod).toBe(baseSlot.startOfPeriod);
  });
});
