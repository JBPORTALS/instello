import type { TimetableData } from "@/components/timetable";
import React from "react";
import {
  AttendanceTable,
  AttendanceTableData,
  AttendanceTableHeaderDates,
  AttendanceTableHeaderLeft,
  AttendanceTableHeaderRight,
} from "@/components/attendance-table";
import Container from "@/components/container";
import { Input } from "@instello/ui/components/input";
import { SearchIcon } from "lucide-react";

// Dummy data
const students = [
  { id: "1", name: "Ravi Kumar" },
  { id: "2", name: "Anjali M" },
  { id: "3", name: "Vinay T" },
  { id: "4", name: "Divya Sharma" },
  { id: "5", name: "Arjun Reddy" },
  { id: "6", name: "Sneha Rao" },
  { id: "7", name: "Karthik S" },
  { id: "8", name: "Megha Nair" },
  { id: "9", name: "Prakash B" },
  { id: "10", name: "Aishwarya D" },
  { id: "11", name: "Rahul Dev" },
  { id: "12", name: "Sushmita K" },
  { id: "13", name: "Nikhil P" },
  { id: "14", name: "Lakshmi V" },
  { id: "15", name: "Deepak M" },
  { id: "16", name: "Harini Iyer" },
  { id: "17", name: "Yashwanth G" },
  { id: "18", name: "Pooja N" },
  { id: "19", name: "Suraj Yadav" },
  { id: "20", name: "Chitra Raj" },
];

//Timetable schema
const timetableData: TimetableData[] = [
  {
    _id: "1",
    startOfPeriod: 1,
    endOfPeriod: 2,
    dayOfWeek: 1,
    subjectName: "Math",
    subjectId: "828jjfkd",
  }, // Monday
  {
    _id: "2",
    startOfPeriod: 3,
    endOfPeriod: 4,
    dayOfWeek: 1,
    subjectName: "Math",
    subjectId: "828jjfkd",
  },
  {
    _id: "3",
    startOfPeriod: 1,
    endOfPeriod: 2,
    dayOfWeek: 2,
    subjectName: "Math",
    subjectId: "828jjfkd",
  }, // Tuesday
  {
    _id: "4",
    startOfPeriod: 2,
    endOfPeriod: 3,
    dayOfWeek: 2,
    subjectName: "Math",
    subjectId: "828jjfkd",
  },
  {
    _id: "5",
    startOfPeriod: 3,
    endOfPeriod: 4,
    dayOfWeek: 3,
    subjectName: "Math",
    subjectId: "828jjfkd",
  }, // Wednesday
];

export default function Page() {
  return (
    <Container className="max-w-[calc(100vw-var(--sidebar-width))] overflow-hidden p-0 md:p-0">
      <AttendanceTable
        students={students}
        selectedDate={new Date()}
        timetableShema={timetableData}
        className="max-h-[calc(100vh-var(--header-height))] min-h-[calc(100vh-var(--header-height))]"
      >
        <React.Fragment>
          <AttendanceTableHeaderLeft>
            <div className="relative flex items-center">
              <SearchIcon className="text-muted-foreground absolute mx-2.5 size-4" />
              <Input placeholder="Search ..." className="pl-8" />
            </div>
          </AttendanceTableHeaderLeft>

          <AttendanceTableHeaderRight>
            <AttendanceTableHeaderDates />
          </AttendanceTableHeaderRight>
        </React.Fragment>

        <AttendanceTableData />
      </AttendanceTable>
    </Container>
  );
}
