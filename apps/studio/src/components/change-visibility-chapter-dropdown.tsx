"use client";

import { useTRPC } from "@/trpc/react";
import { Button } from "@instello/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@instello/ui/components/dropdown-menu";
import { cn } from "@instello/ui/lib/utils";
import {
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function ChangeVisibilityChapter({ chapterId }: { chapterId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: chapter, isLoading } = useQuery(
    trpc.lms.chapter.getById.queryOptions({ chapterId }),
  );

  const { mutate: updateChapter, isPending } = useMutation(
    trpc.lms.chapter.update.mutationOptions({
      async onSuccess(_, v) {
        await queryClient.invalidateQueries(
          trpc.lms.chapter.getById.queryOptions({ chapterId }),
        );
        toast.info(
          `Visibility changed to ${v.isPublished ? "Published" : "Private"}`,
        );
      },
      onError() {
        toast.error(`Couldn't able to change the visibility of chapter`);
      },
    }),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-6"
          size={"icon"}
          disabled={isLoading}
          loading={isPending}
        >
          {chapter?.isPublished ? (
            <GlobeHemisphereEastIcon
              className={cn("size-3.5", isPending && "hidden")}
              weight="duotone"
            />
          ) : (
            <LockLaminatedIcon
              className={cn("size-3.5", isPending && "hidden")}
              weight="duotone"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Chapter Visibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={chapter?.isPublished ? "published" : "private"}
          onValueChange={(value) =>
            updateChapter({ isPublished: value == "published", id: chapterId })
          }
        >
          <DropdownMenuRadioItem value="private">
            <LockLaminatedIcon weight="duotone" />
            Private
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="published">
            <GlobeHemisphereEastIcon weight="duotone" />
            Published
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
