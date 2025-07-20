"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@instello/ui/components/avatar";
import { cn } from "@instello/ui/lib/utils";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
} from "date-fns";

import type { TimetableData } from "../timetable";

// Contexts
interface Student {
  id: string;
  name: string;
}

interface AttendanceTableContextProps {
  students: Student[];
  timetableShema: TimetableData[];
  selectedDate: Date;
}

const AttendanceTableContext =
  React.createContext<AttendanceTableContextProps | null>(null);

function useAttendance() {
  const attendance = React.useContext(AttendanceTableContext);

  if (!attendance) {
    throw new Error("useAttendance not wrraped in the provider");
  }

  const { selectedDate, timetableShema } = attendance;

  const dates = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  function getPeriodsByDate(date: Date) {
    const dow = getDay(date); // 0 - Sunday, 1 - Monday, etc.
    return timetableShema.filter((entry) => entry.dayOfWeek === dow);
  }

  return { ...attendance, getPeriodsByDate, dates };
}

interface AttendanceTableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    AttendanceTableContextProps {}

export function AttendanceTable({
  className,
  children,
  students,
  timetableShema,
  selectedDate,
  ...props
}: AttendanceTableProps) {
  return (
    <AttendanceTableContext.Provider
      value={{ students, timetableShema, selectedDate }}
    >
      <div
        className={cn(
          "grid max-w-svw grid-cols-[200px_1fr] overflow-x-auto overflow-y-auto",
          className,
        )}
        {...props}
      >
        {children}
        {Array.from({ length: Math.max(0, 17 - students.length) }).map(
          (_, i) => (
            <React.Fragment key={`empty-${i}`}>
              <div className="bg-background sticky top-0 left-0 h-12 border-r" />
              <div className="bg-background h-12" />
            </React.Fragment>
          ),
        )}
      </div>
    </AttendanceTableContext.Provider>
  );
}

export function AttendanceTableHeaderLeft({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-background sticky top-0 left-0 z-50 col-span-1 flex h-20 items-center justify-center border-r border-b p-1.5",
        className,
      )}
      {...props}
    />
  );
}

export function AttendanceTableHeaderRight({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-background/60 sticky top-0 z-40 flex h-20 items-center justify-end border-b backdrop-blur-lg",
        className,
      )}
      {...props}
    />
  );
}

export function AttendanceTableData() {
  const { students, dates, getPeriodsByDate } = useAttendance();

  return (
    <>
      {students.map((s) => (
        <React.Fragment key={s.id}>
          <div
            aria-label="student-row"
            className="bg-background/80 border-b-border/50 sticky left-0 z-40 col-span-1 flex h-12 w-full items-center gap-2.5 border-r border-b p-1.5 text-sm backdrop-blur-lg"
          >
            <Avatar className="border">
              <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {s.name}
          </div>
          <div
            aria-label="student-date-row"
            className="bg-background/60 border-b-border/20 flex h-12 items-center justify-end border-b backdrop-blur-lg"
          >
            {dates.map((date, i) => {
              const periods = getPeriodsByDate(date);
              return (
                <div
                  className="flex h-full max-w-max min-w-20 border-r-2"
                  key={`hour-date-student-slot-${i + 1}`}
                >
                  {periods.length === 0 ? (
                    <div className="bg-accent pattern-diagnol-v3 h-full w-full opacity-15" />
                  ) : (
                    periods.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex h-full w-20 items-center justify-center border-r-[.5px] px-1.5 last:border-r-0"
                      />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}

export function AttendanceTableHeaderDates() {
  const { dates, getPeriodsByDate } = useAttendance();

  return (
    <>
      {dates.map((date, i) => (
        <div className="h-full max-w-max min-w-20 border-r-2" key={i + 1}>
          <div
            key={i}
            className="flex h-10 w-full items-center justify-center border-b px-2.5 text-sm"
          >
            {format(date, "dd EEE")}
          </div>

          <div className="flex h-10 w-full items-center">
            {getPeriodsByDate(date).length === 0 ? (
              <div className="bg-accent pattern-diagnol-v3 h-10 w-full opacity-15" />
            ) : (
              getPeriodsByDate(date).map((slot, i) => (
                <div
                  key={slot._id}
                  className="flex h-full w-20 items-center justify-center border-r-[.5px] px-1.5 last:border-r-0"
                >
                  <div
                    className="bg-primary text-primary-foreground flex items-center justify-center rounded-full px-2.5 text-xs"
                    key={i + 1}
                  >
                    H{slot.startOfPeriod} - H{slot.endOfPeriod}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </>
  );
}
