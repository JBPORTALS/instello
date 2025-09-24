"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import Image from "next/image";
import { env } from "@/env";
import { useTRPC } from "@/trpc/react";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateChannelSchema } from "@instello/db/lms";
import { Button, buttonVariants } from "@instello/ui/components/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@instello/ui/components/select";
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
import { cn } from "@instello/ui/lib/utils";
import {
  GearIcon,
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [open, setOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings open={open} channelId={channelId} />;

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

function GeneralSettings({
  channelId,
  open,
}: {
  channelId: string;
  open: boolean;
}) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.lms.channel.getById.queryOptions(
      { channelId },
      { gcTime: 0, enabled: open },
    ),
  );

  const form = useForm({
    resolver: zodResolver(UpdateChannelSchema),
    defaultValues: {
      thumbneilId: data?.thumbneilId ?? "",
      title: data?.title ?? "",
      id: channelId,
      description: data?.description ?? "",
      isPublished: data?.isPublished ?? false,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { mutateAsync: updateChannel } = useMutation(
    trpc.lms.channel.update.mutationOptions({
      async onSuccess(_, variables) {
        toast.info(`Channel info updated`);
        form.reset(variables, {
          keepDirty: false,
          keepDirtyValues: true,
          keepSubmitCount: true,
        });
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
    <Form key={channelId} {...form}>
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
          {isLoading ? (
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

              <FormField
                control={form.control}
                name="thumbneilId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Thumbneil`}</FormLabel>
                    <FormDescription>
                      Upload unique thumbneil to your channel to deliver the
                      course effectively to the audience. This will help them to
                      grab their attention.
                    </FormDescription>
                    <div className="aspect-video h-[150px] w-[280] overflow-hidden rounded-md">
                      {field.value ? (
                        <div className="relative h-full w-full">
                          <Image
                            fill
                            alt={`Channel Thumbneil`}
                            src={`https://${env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${field.value}`}
                          />
                          <div className="bg-background/40 absolute flex h-full w-full items-center justify-center transition-all duration-200">
                            <UploadButton
                              config={{ cn }}
                              appearance={{
                                button: buttonVariants({
                                  className: "rounded-full",
                                  size: "lg",
                                }),
                              }}
                              input={{ channelId }}
                              endpoint={"channelThumbneilUploader"}
                              onClientUploadComplete={async (res) => {
                                form.reset(
                                  {
                                    thumbneilId:
                                      res.at(0)?.serverData.newThumbneilId ??
                                      "",
                                  },
                                  { keepDirty: false },
                                );
                                await queryClient.invalidateQueries(
                                  trpc.lms.channel.getById.queryOptions({
                                    channelId,
                                  }),
                                );
                                toast.info(`Channel thumbneil image changed.`);
                              }}
                              onUploadError={(e) => {
                                toast.error(e.message);
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <UploadDropzone
                          input={{ channelId }}
                          className="h-full w-full"
                          endpoint={"channelThumbneilUploader"}
                          config={{ mode: "auto" }}
                          onClientUploadComplete={async (res) => {
                            form.reset(
                              {
                                thumbneilId:
                                  res.at(0)?.serverData.newThumbneilId ?? "",
                              },
                              { keepDirty: false },
                            );
                            await queryClient.invalidateQueries(
                              trpc.lms.channel.getById.queryOptions({
                                channelId,
                              }),
                            );
                            toast.info(`Added channel thumbneil image.`);
                          }}
                        />
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Visibility`}</FormLabel>
                    <FormDescription>
                      You can make the channel public to make it accesible for
                      students
                    </FormDescription>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value) =>
                          field.onChange(value == "public")
                        }
                        value={field.value ? "public" : "private"}
                      >
                        <SelectTrigger className="min-w-sm">
                          <SelectValue placeholder={"Select..."} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">
                            <LockLaminatedIcon weight="duotone" /> Private
                          </SelectItem>
                          <SelectItem value="public">
                            <GlobeHemisphereEastIcon weight="duotone" /> Public
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
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
