"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@instello/ui/components/accordion";
import { HashIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function ChapterList() {
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.chapter.list.queryOptions({ channelId }),
  );

  if (data.length === 0)
    return (
      <div className="flex min-h-40 w-full flex-col items-center justify-center gap-2.5 px-16">
        <HashIcon
          size={40}
          weight="duotone"
          className="text-muted-foreground"
        />
        <div>No chapters</div>
        <p className="text-muted-foreground max-w-md text-center text-sm">
          Chapters are the small pieces of large channel to post your knowledge.
          Create one by clicking on the new button on the top.
        </p>
      </div>
    );

  return (
    <Accordion collapsible type="single">
      {data.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent></AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
