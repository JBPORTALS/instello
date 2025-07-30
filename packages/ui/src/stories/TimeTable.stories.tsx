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

function TimeTableStory(args: Partial<React.ComponentProps<typeof TimeTable>>) {
  const [slots, setSlots] = React.useState(args.slots);

  return (
    <>
      {/* <pre>{JSON.stringify(slots, undefined, 1)}</pre> */}
      <TimeTable {...args} slots={slots} onChangeSlots={setSlots} />
    </>
  );
}

export const WithSlots: StoryObj<React.ComponentProps<typeof TimeTable>> = {
  args: {
    slots: [
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
        startOfPeriod: 2,
        endOfPeriod: 4,
        subject: "Physics",
      },
      {
        id: "3",
        dayOfWeek: 3,
        startOfPeriod: 2,
        endOfPeriod: 4,
        subject: "Science",
      },
    ],
    editable: true,
    numberOfHours: 7,
  },
  render: TimeTableStory,
};
