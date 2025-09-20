import { RouterOutputs } from "@instello/api";
import { create } from "zustand";

export type Course = Omit<
  RouterOutputs["lms"]["courseOrBranch"]["list"][number],
  "courseId"
>;

export type Branch = RouterOutputs["lms"]["courseOrBranch"]["list"][number];

type OnboardingState = {
  fullName: string;
  dob: Date;
  course?: Course;
  branch?: Branch;
  setField: <K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K],
  ) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  fullName: "",
  dob: new Date(),
  setField: (key, value) => set({ [key]: value }),
  reset: () =>
    set({
      fullName: "",
      dob: new Date(),
      course: undefined,
      branch: undefined,
    }),
}));
