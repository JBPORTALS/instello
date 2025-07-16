"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStudentSchema } from "@instello/db/schema";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@instello/ui/components/form";
import { Input } from "@instello/ui/components/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateStudentDialog(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      usn: "",
    },
  });

  const { branchId } = useParams<{ branchId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: createStudent } = useMutation(
    trpc.student.create.mutationOptions({
      async onSuccess(_data, variables) {
        await queryClient.invalidateQueries(trpc.student.list.queryFilter());
        toast.success(`${variables.firstName} ${variables.lastName} added.`);
        setOpen(false);
        form.reset();
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof CreateStudentSchema>) {
    await createStudent({ ...values, branchId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} asChild />
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle>New Student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <div className="grid-col-2 grid grid-flow-col gap-3.5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Raghavan" {...field} />
                      </FormControl>
                      <div className="h-4">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="R" {...field} />
                      </FormControl>
                      <div className="h-4">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-3.5 py-3.5">
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="eg. studentemail@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usn"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Unique Student Identifier</FormLabel>
                      <FormControl>
                        <Input placeholder="eg. 364CS19013" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="text-xs">
                        This must be unique within your institution.
                      </FormDescription>
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
