"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { env } from "@/env";
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
      <div className="bg-accent h-58 relative aspect-video w-full overflow-hidden rounded-md object-cover">
        {data.thumbneilId ? (
          <Image
            fill
            alt="Channel Thumbneil"
            src={`https://${env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${data.thumbneilId}`}
            objectFit="cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground font-mono text-3xl font-bold opacity-50">
              No Thumbneil
            </span>
          </div>
        )}
      </div>

      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {data.title}
        </h4>
        <p className="text-muted-foreground text-sm">{data.description}</p>
      </div>
    </div>
  );
}
