"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@instello/ui/components/alert-dialog";
import { Button } from "@instello/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteChapterDialog({
  children,
  chapterId,
}: {
  children: React.ReactNode;
  chapterId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const queryClient = useQueryClient();
  const { mutate: deleteVideo, isPending } = useMutation(
    trpc.lms.chapter.delete.mutationOptions({
      async onSuccess(data) {
        toast.info(
          <span>
            Chapter <b>{data.title}</b> deleted
          </span>,
        );
        await queryClient.invalidateQueries(
          trpc.lms.chapter.list.queryOptions({ channelId }),
        );
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chapter permanently</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting the chapter will remove all it's content including the
            video assets from cloud paramanently. This action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </AlertDialogCancel>
          <Button
            loading={isPending}
            onClick={() => deleteVideo({ chapterId })}
            variant={"destructive"}
          >
            Delete Forever
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
