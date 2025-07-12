"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBranchSchema as _CreateBranchSchema } from "@instello/db/schema";
import { Button } from "@instello/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@instello/ui/components/select";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import type { IconPickerIcon } from "./icon-picker";
import IconPicker, { TablerReactIcon } from "./icon-picker";

const CreateBranchSchema = _CreateBranchSchema;

export function CreateBranchDialog(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateBranchSchema),
    defaultValues: {
      name: "",
      icon: "IconCircleFilled",
      currentSemesterMode: "odd",
      totalSemesters: 6,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateBranchSchema>) {}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} asChild />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Branch</DialogTitle>
          <DialogDescription>
            An workspace for specific course within the organization
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <DialogBody>
              <div className="grid grid-cols-8">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <IconPicker value={field.value} onChange={field.onChange}>
                        <TablerReactIcon
                          className="size-11 [&_svg]:size-6"
                          isActive
                          name={field.value as IconPickerIcon}
                        />
                      </IconPicker>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-7">
                      <FormControl>
                        <Input
                          placeholder="Computer Science"
                          className="h-11 text-sm md:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogBody>
            <DialogFooter className="flex justify-between">
              <div className="flex w-full gap-1">
                <FormField
                  control={form.control}
                  name="totalSemesters"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(v) => field.onChange(parseInt(v))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-accent/60 h-8 min-w-24 text-xs">
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs">
                          <SelectItem value="4">4 Semesters</SelectItem>
                          <SelectItem value="6">6 Semesters</SelectItem>
                          <SelectItem value="8">8 Semesters</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSemesterMode"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(v) => field.onChange(parseInt(v))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-accent/60 h-8 min-w-24 text-xs">
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="odd">Start with odd</SelectItem>
                          <SelectItem value="even">Starts with even</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button loading={form.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
