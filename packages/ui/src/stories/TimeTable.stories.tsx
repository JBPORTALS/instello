import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";

import { TimeTable } from "../components/time-table";

const meta = {
  title: "UI/TimeTable",
  tags: ["autodocs"],
  component: TimeTable,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TimeTable>;

export default meta;

export const Default: StoryObj = {
  render: () => <TimeTable editable />,
};

function TimeTableStory() {
  const [slots, setSlots] = React.useState([
    {
      id: "1",
      dayOfWeek: 1,
      startOfPeriod: 1,
      endOfPeriod: 3,
      subject: "Math",
    },
    {
      id: "2",
      dayOfWeek: 2,
      startOfPeriod: 1,
      endOfPeriod: 2,
      subject: "Physics",
    },
  ]);

  return (
    <>
      <pre>{JSON.stringify(slots, undefined, 1)}</pre>
      <TimeTable editable slots={slots} onChangeSlots={setSlots} />
    </>
  );
}

export const WithSlots: StoryObj = {
  render: () => <TimeTableStory />,
};
