"use client";

import type { TimetableInput } from "@/components/timetable";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ReactTimetable } from "@/components/timetable";
import { useTRPC } from "@/trpc/react";
import { Button } from "@instello/ui/components/button";
import { Input } from "@instello/ui/components/input";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function TimetableClient() {
  const { branchId, slug, semesterId } = useParams<{
    branchId: string;
    slug: string;
    semesterId: string;
  }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.timetable.findByActiveSemester.queryOptions({ branchId }),
  );

  const timetableSlots = data.timetableData?.timetableSlots.map((s) => ({
    ...s,
    subjectName: s.subject.name,
  }));
  const [slots, setSlots] = React.useState<TimetableInput[]>(
    timetableSlots ?? [],
  );

  const [message, setMessage] = React.useState("");
  const router = useRouter();
  const { mutate: createTimetable, isPending } = useMutation(
    trpc.timetable.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.timetable.pathFilter());
        router.replace(`/${slug}/b/${branchId}/s/${semesterId}/timetable`);
        toast.success(`Timetable updated`);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <React.Fragment>
      <div className="inline-flex w-full justify-between">
        <h2 className="text-3xl font-semibold">New Schedule</h2>

        <div className="inline-flex gap-3.5">
          <Input
            className="min-w-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Comiit message..."
          />
          <Button
            loading={isPending}
            onClick={() =>
              createTimetable({
                slots,
                branchId,
                semesterId,
                effectiveFrom: new Date(),
                message,
              })
            }
            disabled={slots.length == 0 || message.length == 0}
          >
            Publish
          </Button>
        </div>
      </div>
      <ReactTimetable
        timetableSlots={slots}
        onDataChange={(data) => setSlots(data)}
        editable
      />
    </React.Fragment>
  );
}
