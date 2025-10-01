"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCouponSchema } from "@instello/db/lms";
import { Button } from "@instello/ui/components/button";
import { Calendar } from "@instello/ui/components/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@instello/ui/components/popover";
import { Tabs, TabsList, TabsTrigger } from "@instello/ui/components/tabs";
import { cn } from "@instello/ui/lib/utils";
import { ArrowRightIcon, CalendarIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateCouponDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { channelId } = useParams<{ channelId: string }>();
  const form = useForm({
    resolver: zodResolver(CreateCouponSchema),
    defaultValues: {
      code: "",
      maxRedemptions: 10,
      subscriptionDurationDays: 30,
      type: "general",
      valid: { from: new Date(), to: new Date() },
      channelId,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: createCoupon } = useMutation(
    trpc.lms.coupon.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.lms.coupon.list.queryFilter());
        setOpen(false);
        form.reset();
        toast.success("Coupon created successfully");
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof CreateCouponSchema>) {
    await createCoupon(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">New Coupon</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Tabs
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as "general" | "targeted")
                        }
                      >
                        <TabsList className="w-full">
                          <TabsTrigger value="general" className="text-xs">
                            General Coupon
                          </TabsTrigger>
                          <TabsTrigger value="targeted" className="text-xs">
                            Targeted Coupon
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 text-2xl font-semibold uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Set validation period</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal")}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {format(field.value.from, "PP")}
                              <ArrowRightIcon
                                weight="duotone"
                                className="text-muted-foreground"
                              />
                              {format(field.value.to, "PP")}
                            </span>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < subDays(new Date(), 1)}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Student can claim this coupon within specific period
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxRedemptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Set max redemptions</FormLabel>
                    <FormControl>
                      <div className="relative inline-flex w-40 rounded-md">
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="pr-10"
                        />
                        <div className="bg-muted text-muted-foreground absolute right-0 flex h-full items-center justify-center rounded-e-md border px-2.5 text-sm">
                          Students
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Only sepeficied number of students can use this coupon
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscriptionDurationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Set subscription days</FormLabel>
                    <FormControl>
                      <div className="relative inline-flex w-40 rounded-md">
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="pr-10"
                        />
                        <div className="bg-muted text-muted-foreground absolute right-0 flex h-full items-center justify-center rounded-e-md border px-2.5 text-sm">
                          Days
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Student can claim subscription for specific number of days
                    </FormDescription>
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
