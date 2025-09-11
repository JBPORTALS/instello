"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateChapterSchema } from "@instello/db/lms";
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
import { Skeleton } from "@instello/ui/components/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditChapterDialog({
  children,
  chapterId,
}: {
  children: React.ReactNode;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(UpdateChapterSchema),
    async defaultValues() {
      const data = await queryClient.fetchQuery(
        trpc.lms.chapter.getById.queryOptions({ chapterId }, { gcTime: 0 }),
      );

      return {
        title: data?.title ?? "",
        id: chapterId,
      };
    },
  });

  const { mutateAsync: createChapter } = useMutation(
    trpc.lms.chapter.update.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(
          trpc.lms.chapter.list.queryFilter(),
        );
        setOpen(false);
        form.reset({ title: data?.title });
        toast.error("Chapter details updated");
      },
      onError() {
        toast.error("Failed to update the chapter");
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof UpdateChapterSchema>) {
    await createChapter(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chapter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            {form.formState.isLoading ? (
              <DialogBody className="flex items-center justify-center">
                <Skeleton className="h-11 w-full" />
              </DialogBody>
            ) : (
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
            )}
            <DialogFooter>
              <Button
                disabled={form.formState.isLoading}
                loading={form.formState.isSubmitting}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
