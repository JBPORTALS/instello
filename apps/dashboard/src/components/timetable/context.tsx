"use client";

import React from "react";

import type { TimetableData } from ".";

export interface ReactTimetableContextProps {
  editable?: boolean;
  timetableSlots: TimetableData[];
  addSlot: (data: Omit<TimetableData, "_id">) => void;
  removeSlot: (_id: string) => void;
}

export const ReactTimetableContext =
  React.createContext<ReactTimetableContextProps | null>(null);

export function useReactTimetable() {
  const context = React.useContext(ReactTimetableContext);

  if (!context)
    throw new Error("useReactTimetable has be wrap within provider");

  return context;
}
