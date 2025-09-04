"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function ChannelDetailsSection() {
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.channel.getById.queryOptions({ channelId }),
  );

  return (
    <div className="space-y-3.5">
      <div className="bg-accent aspect-video h-72 w-full rounded-md" />

      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {data?.title}
        </h4>
        <p className="text-muted-foreground text-sm">{data?.description}</p>
      </div>
    </div>
  );
}
