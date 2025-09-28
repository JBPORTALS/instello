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

export function DeleteCouponDialog({
  children,
  couponId,
}: {
  children: React.ReactNode;
  couponId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { channelId } = useParams<{ channelId: string }>();
  const { mutate: deleteCoupon, isPending } = useMutation(
    trpc.lms.coupon.delete.mutationOptions({
      async onSuccess(data) {
        toast.info(
          <span>
            Coupon <b>{data?.code}</b> deleted
          </span>,
        );
        await queryClient.invalidateQueries(
          trpc.lms.coupon.list.queryOptions({ channelId }),
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
          <AlertDialogTitle>Delete coupon permanently</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting the coupon will revoke further access by students by using
            the coupon code. This action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </AlertDialogCancel>
          <Button
            loading={isPending}
            onClick={() => deleteCoupon({ couponId })}
            variant={"destructive"}
          >
            Delete Forever
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
