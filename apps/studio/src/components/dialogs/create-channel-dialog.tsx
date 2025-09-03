"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
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
  FormMessage,
} from "@instello/ui/components/form";
import { Input } from "@instello/ui/components/input";
import { useForm } from "react-hook-form";

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
      thumbneilId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateChannelSchema>) {}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Channel</DialogTitle>
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
                        placeholder="eg. Artificial Intelligence"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
              <Button>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
