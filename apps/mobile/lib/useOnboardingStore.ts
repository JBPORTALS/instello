import { create } from "zustand";

export type Course = { id: string; title: string };

export type Branch = { id: string; title: string };

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
