"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSubjectSchema } from "@instello/db/schema";
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

export function CreateSubjectDialog(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateSubjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const { branchId } = useParams<{ branchId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: createBranch } = useMutation(
    trpc.subject.create.mutationOptions({
      async onSuccess(_data, variables) {
        await queryClient.invalidateQueries(trpc.subject.list.queryFilter());
        toast.success(`${variables.name} created.`);
        setOpen(false);
        form.reset();
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof CreateSubjectSchema>) {
    await createBranch({ ...values, branchId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} asChild />
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle>New Subject</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="eg. Mathemetics"
                        className="text-sm font-medium md:text-base"
                        {...field}
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
