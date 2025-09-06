"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@instello/ui/components/accordion";
import { Button } from "@instello/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@instello/ui/components/dropdown-menu";
import {
  DotsThreeOutlineIcon,
  HashIcon,
  PenNibIcon,
  PlusSquareIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { UploadVideoDialog } from "./dialogs/upload-video-dialog";
import { VideosList } from "./videos-list";

export function ChapterList() {
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.chapter.list.queryOptions({ channelId }),
  );

  const [openChapter, setOpenChapter] = useState<string | undefined>(
    data.at(0)?.id, // default open first
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
    <Accordion
      type="single"
      collapsible
      value={openChapter}
      onValueChange={(val) => setOpenChapter(val)}
      className="space-y-3.5"
    >
      {data.map((item) => (
        <AccordionItem
          key={item.id}
          className="bg-accent/30 rounded-lg border border-b-0"
          value={item.id}
        >
          <AccordionHeader className="group inline-flex w-full flex-1 items-center justify-between space-x-3.5 px-6">
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="[&>svg]:size-3! size-6 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                >
                  <DotsThreeOutlineIcon weight="duotone" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[150px]">
                <UploadVideoDialog chapterId={item.id}>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <PlusSquareIcon weight="duotone" /> Add video...
                  </DropdownMenuItem>
                </UploadVideoDialog>
                <DropdownMenuItem>
                  <PenNibIcon weight="duotone" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <TrashSimpleIcon weight="duotone" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </AccordionHeader>
          <AccordionContent className="px-3.5">
            {/* Only fetch and render when this chapter is open */}
            {openChapter === item.id ? (
              <VideosList chapterId={item.id} />
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
