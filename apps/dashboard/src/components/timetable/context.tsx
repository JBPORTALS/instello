"use client";

import React from "react";

export interface ReactTimetableContextProps {
  editable: boolean;
}

export const ReactTimetableContext =
  React.createContext<ReactTimetableContextProps | null>(null);

export function useReactTimetable() {
  const context = React.useContext(ReactTimetableContext);

  if (!context)
    throw new Error("useReactTimetable has be wrap within provider");

  return context;
}
