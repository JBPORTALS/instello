"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateChannelSchema } from "@instello/db/lms";
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
  FormLabel,
  FormMessage,
} from "@instello/ui/components/form";
import { Input } from "@instello/ui/components/input";
import { Textarea } from "@instello/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateChannelDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbneilId: "https://i.ytimg.com",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: createChannel } = useMutation(
    trpc.lms.channel.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.lms.channel.list.queryFilter(),
        );
        setOpen(false);
        form.reset();
      },
      onError() {
        toast.error("Failed to create channel");
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof CreateChannelSchema>) {
    await createChannel(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="@container/dialog-content sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>New Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <DialogBody className="flex gap-5">
              <div>
                <div className="bg-accent/60 aspect-video h-auto rounded-md @sm:w-lg"></div>
              </div>
              <div className="w-full space-y-3.5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 text-2xl font-semibold"
                          placeholder="eg. Artificial Intelligence"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Description (Optional)"}</FormLabel>
                      <FormControl className="h-full">
                        <Textarea
                          {...field}
                          maxLength={256}
                          className="h-28 resize-none"
                          placeholder="Add description..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
