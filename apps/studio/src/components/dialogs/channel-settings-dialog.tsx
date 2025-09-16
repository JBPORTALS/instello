"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateChannelSchema } from "@instello/db/lms";
import { Button } from "@instello/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@instello/ui/components/sidebar";
import { Spinner } from "@instello/ui/components/spinner";
import { Textarea } from "@instello/ui/components/textarea";
import { GearIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const navigationItems: {
  id: "general" | null;
  label: string;
  icon?: React.ReactNode;
}[] = [{ id: "general", label: "General", icon: <GearIcon /> }];

type NavigationItem = (typeof navigationItems)[number]["id"];

export function ChannelSettingsDialog({
  children,
  channelId,
}: {
  children: React.ReactNode;
  channelId: string;
}) {
  const [activeTab, setActiveTab] = useState<NavigationItem>("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings channelId={channelId} />;

      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="to-[50%] sm:max-w-6xl"
      >
        <SidebarProvider
          className="min-h-full"
          style={{ "--sidebar-width": "14rem" } as React.CSSProperties}
        >
          <Sidebar className="h-full">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Channel Settings</SidebarGroupLabel>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                      >
                        {item.icon}
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex flex-col overflow-y-scroll">
            {renderContent()}
          </SidebarInset>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}

function GeneralSettings({ channelId }: { channelId: string }) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm({
    resolver: zodResolver(UpdateChannelSchema),
    async defaultValues() {
      const data = await queryClient.fetchQuery(
        trpc.lms.channel.getById.queryOptions({ channelId }, { gcTime: 0 }),
      );

      return {
        thumbneilId: data?.thumbneilId ?? "",
        title: data?.title ?? "",
        id: channelId,
        description: data?.description ?? "",
        isPublished: data?.isPublished ?? false,
      };
    },
    mode: "onChange",
    resetOptions: {
      keepDefaultValues: true,
      keepDirty: false,
      keepIsSubmitSuccessful: true,
      keepDirtyValues: true,
    },
  });

  const { mutateAsync: updateChannel } = useMutation(
    trpc.lms.channel.update.mutationOptions({
      async onSuccess(_, variables) {
        toast.info(`Channel info updated`);
        form.reset(variables);
        await queryClient.invalidateQueries(trpc.lms.channel.pathFilter());
      },
      onError(error) {
        console.error(error);
        toast.error(`Couldn't able to update the channel info`);
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof UpdateChannelSchema>) {
    await updateChannel(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle>General Settings</DialogTitle>

          <div className="space-x-1.5 pr-6">
            <Button
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              className="rounded-full"
              variant={"secondary"}
              type="button"
              onClick={() => form.reset()}
            >
              Discard changes
            </Button>
            <Button
              disabled={!form.formState.isDirty}
              loading={form.formState.isSubmitting}
              className="rounded-full"
            >
              Save
            </Button>
          </div>
        </DialogHeader>
        <DialogBody className="container/settings-main max-h-[calc(100vh-200px)] min-h-[calc(100vh-200px)] space-y-6 py-6">
          {form.formState.isLoading ? (
            <div className="flex min-h-[500] w-full items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : (
            <>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Title of the channel"
                        maxLength={100}
                        className="resize-none"
                        {...field}
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
                    <FormLabel>{`Description (optional)`}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell viewers about your channel..."
                        maxLength={256}
                        className="max-h-28 min-h-28 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      It will help us to improve the reach of your channel to
                      the right viewers.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}
        </DialogBody>
      </form>
    </Form>
  );
}
