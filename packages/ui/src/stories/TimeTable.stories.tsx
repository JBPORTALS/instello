import type { Meta, StoryObj } from "@storybook/nextjs";

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

export const WithSlots: StoryObj = {
  render: () => (
    <TimeTable
      editable
      slots={[
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
          startOfPeriod: 4,
          endOfPeriod: 5,
          subject: "Physics",
        },
      ]}
    />
  ),
};
