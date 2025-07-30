import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { action } from "storybook/actions";

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

  const logAction = action("onChangeSlots");

  return (
    <>
      {/* <pre>{JSON.stringify(slots, undefined, 1)}</pre> */}
      <TimeTable
        {...args}
        slots={slots}
        onChangeSlots={(slots) => {
          setSlots(slots);
          logAction(slots);
        }}
      />
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
  argTypes: {
    editable: { type: "boolean" },
    onChangeSlots: { type: "function" },
  },
  render: TimeTableStory,
};
