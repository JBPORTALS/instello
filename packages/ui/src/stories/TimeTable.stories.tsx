import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { action } from "storybook/actions";

import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
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

export type Story = StoryObj<typeof TimeTable>;

export const Default: Story = {
  render: (args) => <TimeTable {...args} />,
};

function TimeTableStory(args: Partial<React.ComponentProps<typeof TimeTable>>) {
  const [slots, setSlots] = React.useState(args.slots);

  const logAction = action("onChangeSlots");

  return (
    <TimeTable
      {...args}
      slots={slots}
      onChangeSlots={(slots) => {
        setSlots(slots);
        logAction(slots);
      }}
      slotRender={(slot) => (
        <div className="flex w-full flex-col items-start gap-3.5 p-3.5">
          <div className="inline-flex items-center gap-1.5 text-sm">
            <div className="size-4 rounded-full bg-indigo-600" />
            {slot.subject}
          </div>
          <div className="inline-flex items-center gap-2">
            <div className="inline-flex -space-x-1.5">
              <Avatar className="border-accent size-6 border-2">
                <AvatarImage src={"https://github.com/JBPORTALS.png"} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar className="border-accent size-6 border-2">
                <AvatarImage src={"https://github.com/gayathriemparala.png"} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-muted-foreground text-xs">JBP & GE</p>
          </div>
        </div>
      )}
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
  );
}

export const WithSlotsEditable: Story = {
  args: {
    editable: true,
  },
  render: TimeTableStory,
};

export const WithSlotsReadOnly: Story = {
  render: TimeTableStory,
};
