import React from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@instello/ui/components/command";
import { Popover, PopoverContent } from "@instello/ui/components/popover";
import { Spinner } from "@instello/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";

import type { PopoverState } from ".";
import { useReactTimetable } from "./context";

export function SubjectPopover({
  position,
  dayIdx,
  period,
  onOpenChange,
}: PopoverState & { onOpenChange: (open: boolean) => void }) {
  const trpc = useTRPC();
  const { branchId } = useParams<{ branchId: string }>();
  const { data, isLoading } = useQuery(
    trpc.subject.list.queryOptions({ branchId }),
  );
  const { addSlot } = useReactTimetable();

  return (
    <Popover open onOpenChange={onOpenChange}>
      <PopoverContent
        style={{
          left: position.x,
          position: "fixed",
          top: position.y,
          zIndex: 50,
        }}
        className="max-w-[200px] p-0"
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            {isLoading ? (
              <div className="flex min-h-[100] items-center justify-center">
                <Spinner className="size-6" />
              </div>
            ) : (
              <>
                <CommandEmpty>No subjects.</CommandEmpty>
                <CommandGroup>
                  {data?.map((sub) => (
                    <CommandItem
                      onSelect={(v) => {
                        addSlot({
                          dayOfWeek: dayIdx,
                          startOfPeriod: period,
                          endOfPeriod: period,
                          subjectId: v,
                          subjectName: sub.name,
                        });
                        onOpenChange(false);
                      }}
                      key={sub.id}
                      value={sub.id}
                    >
                      {sub.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
