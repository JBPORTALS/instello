"use client";

import { useTRPC } from "@/trpc/react";
import { Skeleton } from "@instello/ui/components/skeleton";
import { PlayCircleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

export function VideosList({ chapterId }: { chapterId: string }) {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useQuery(
    trpc.lms.video.list.queryOptions(
      { chapterId },
      {
        refetchInterval: (q) => {
          // keep polling only if any video is still processing
          return q.state.data?.some(
            (v) => v.status === "waiting" || v.status === "asset_created",
          )
            ? 3000
            : false;
        },
      },
    ),
  );

  if (isLoading)
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 })
          .fill(0)
          .flatMap((_, i) => (
            <Skeleton className="h-9 w-full" key={i} />
          ))}
      </div>
    );

  if (isError || !data)
    return <div>Couldn't able to fetch the lesson videos of this chapter</div>;

  if (data.length === 0)
    return (
      <div className="text-muted-foreground px-2.5 text-sm">
        No videos, this chapter won't be available to students until it contains
        videos.
      </div>
    );

  return (
    <div className="w-full space-y-2">
      {data.map((item) => (
        <div
          className="bg-accent/60 hover:bg-accent hover:text-accent-foreground flex h-9 w-full items-center gap-1.5 rounded-md border px-2 hover:cursor-pointer"
          key={item.id}
        >
          <PlayCircleIcon className="size-5" width={"duotone"} />
          <span className="text-xs font-semibold">{item.title}</span>
          <span className="text-muted-foreground ml-auto text-xs">
            {item.status === "waiting" && "Processing..."}
            {item.status === "asset_created" && "Processing asset..."}
            {item.status === "errored" && "Failed"}
            {item.status === "cancelled" && "Cancelled"}
            {item.status === "ready" && "Ready to watch"}
          </span>
        </div>
      ))}
    </div>
  );
}
