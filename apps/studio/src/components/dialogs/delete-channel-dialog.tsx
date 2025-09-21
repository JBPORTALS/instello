"use client";

import React from "react";
import { useRouter } from "next/navigation";
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

export function DeleteChannelDialog({
  children,
  channelId,
}: {
  children: React.ReactNode;
  channelId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteChannel, isPending } = useMutation(
    trpc.lms.channel.delete.mutationOptions({
      async onSuccess(data) {
        toast.info(`Channel ${data.title} deleted`);
        await queryClient.invalidateQueries(
          trpc.lms.channel.list.queryOptions(),
        );
        router.replace("/");
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
          <AlertDialogTitle>Delete channel permanently</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting the channel will remove all it's chapters and videos from
            cloud paramanently. This action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </AlertDialogCancel>
          <Button
            loading={isPending}
            onClick={() => deleteChannel({ channelId })}
            variant={"destructive"}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
