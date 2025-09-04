"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateChapterSchema } from "@instello/db/lms";
import { Button } from "@instello/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@instello/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@instello/ui/components/form";
import { Input } from "@instello/ui/components/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateChapterDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { channelId } = useParams<{ channelId: string }>();
  const form = useForm({
    resolver: zodResolver(CreateChapterSchema),
    defaultValues: {
      title: "",
      channelId,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: createChapter } = useMutation(
    trpc.lms.chapter.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.lms.chapter.list.queryFilter(),
        );
        setOpen(false);
        form.reset();
      },
      onError() {
        toast.error("Failed to create chapter");
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof CreateChapterSchema>) {
    await createChapter(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chapter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <DialogBody>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 text-2xl font-semibold"
                        placeholder="eg. Chapter 1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
              <Button loading={form.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
