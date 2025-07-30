import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { action } from "storybook/actions";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { TimeTable } from "../components/time-table";

const subjects = [
  { id: crypto.randomUUID(), value: "Mathemetics", label: "Mathemetics" },
  { id: crypto.randomUUID(), value: "Science", label: "Science" },
  { id: crypto.randomUUID(), value: "Urdu", label: "Urdu" },
  { id: crypto.randomUUID(), value: "Kannada", label: "Kannada" },
  { id: crypto.randomUUID(), value: "English", label: "English" },
];

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
            <PopoverTrigger
              style={{ position: "fixed", top: position.y, left: position.x }}
              className="size-2"
            />
            <PopoverContent align="center" className="w-52 p-0">
              <Command>
                <CommandInput />
                <CommandGroup>
                  <CommandList>
                    {subjects.map((subject) => (
                      <CommandItem
                        key={subject.id}
                        value={subject.value}
                        onSelect={(subject) => {
                          actions.addSlot({ ...slotInfo, subject });
                        }}
                      >
                        {subject.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
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
