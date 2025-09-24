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
  CaretDownIcon,
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function ChangeVisibilityVideoDropdown({
  videoId,
}: {
  videoId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: chapter, isLoading } = useQuery(
    trpc.lms.video.getById.queryOptions({ videoId }),
  );

  const { mutate: updateVideo, isPending } = useMutation(
    trpc.lms.video.update.mutationOptions({
      async onSuccess(_, v) {
        await queryClient.invalidateQueries(trpc.lms.video.pathFilter());
        toast.info(
          `Visibility changed to ${v.isPublished ? "Published" : "Private"}`,
        );
      },
      onError() {
        toast.error(`Couldn't able to change the visibility of video`);
      },
    }),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size={"sm"}
          className="rounded-full"
          disabled={isLoading}
          loading={isPending}
        >
          {chapter?.isPublished ? (
            <span className="inline-flex items-center gap-1.5">
              <GlobeHemisphereEastIcon
                className={cn("size-3.5", isPending && "hidden")}
                weight="duotone"
              />{" "}
              Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <LockLaminatedIcon
                className={cn("size-3.5", isPending && "hidden")}
                weight="duotone"
              />{" "}
              Private
            </span>
          )}

          <CaretDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Chapter Visibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={chapter?.isPublished ? "published" : "private"}
          onValueChange={(value) =>
            updateVideo({ isPublished: value == "published", videoId })
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
