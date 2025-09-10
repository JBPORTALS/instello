"use client";

import React from "react";
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

export function DeleteVideoDialog({
  children,
  chapterId,
  videoId,
}: {
  children: React.ReactNode;
  chapterId: string;
  videoId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: deleteVideo, isPending } = useMutation(
    trpc.lms.video.delete.mutationOptions({
      async onSuccess(data) {
        toast.info(`Video ${data.title} deleted`);
        await queryClient.invalidateQueries(
          trpc.lms.video.list.queryOptions({ chapterId }),
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
          <AlertDialogTitle>Delete video permanently</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting the video will remove all it's content from cloud
            paramanently. This action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </AlertDialogCancel>
          <Button
            loading={isPending}
            onClick={() => deleteVideo({ videoId })}
            variant={"destructive"}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
