import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { action } from "storybook/actions";

import { Popover, PopoverContent } from "../components/popover";
import { TimeTable } from "../components/time-table";

const meta = {
  title: "UI/TimeTable",
  tags: ["autodocs"],
  component: TimeTable,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    numberOfHours: {
      type: "number",
      table: { category: "settings" },
    },
    editable: {
      type: "boolean",
      table: {
        category: "settings",
      },
    },
    onChangeSlots: { type: "function" },
  },
} satisfies Meta<typeof TimeTable>;

export default meta;

export const Default: StoryObj = {
  render: (args) => <TimeTable {...args} />,
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
        EmptySlotPopoverComponent={({ position, slotInfo, actions, close }) => (
          <Popover open onOpenChange={close}>
            <PopoverContent
              style={{ position: "fixed", top: position.y, left: position.x }}
              align="start"
              side="right"
              className="w-64"
            >
              <div className="text-sm">
                <div className="mb-2 font-medium">
                  Add subject for H{slotInfo.startOfPeriod} (
                  {slotInfo.dayOfWeek})
                </div>
                <button
                  onClick={() => {
                    actions.addSlot({
                      subject: "Math",
                      ...slotInfo,
                    });
                    close();
                  }}
                  className="rounded bg-blue-600 px-3 py-1 text-white"
                >
                  Add Math
                </button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      />
    </>
  );
}

export const WithSlots: StoryObj<React.ComponentProps<typeof TimeTable>> = {
  args: {
    slots: [
      {
        id: crypto.randomUUID(),
        dayOfWeek: 1,
        startOfPeriod: 1,
        endOfPeriod: 3,
        subject: "Math",
      },
      {
        id: crypto.randomUUID(),
        dayOfWeek: 1,
        startOfPeriod: 4,
        endOfPeriod: 5,
        subject: "Math",
      },
      {
        id: crypto.randomUUID(),
        dayOfWeek: 2,
        startOfPeriod: 2,
        endOfPeriod: 4,
        subject: "Physics",
      },
      {
        id: crypto.randomUUID(),
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
