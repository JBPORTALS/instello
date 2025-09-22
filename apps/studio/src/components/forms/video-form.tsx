"use client";

import type { z } from "zod/v4";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateVideoSchema } from "@instello/db/lms";
import { Button } from "@instello/ui/components/button";
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
import { Textarea } from "@instello/ui/components/textarea";
import MuxPlayer from "@mux/mux-player-react/lazy";
import {
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
} from "@phosphor-icons/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function VideoForm() {
  const { videoId } = useParams<{ videoId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isError } = useSuspenseQuery(
    trpc.lms.video.getById.queryOptions({ videoId }),
  );

  const form = useForm({
    resolver: zodResolver(UpdateVideoSchema),
    defaultValues: {
      title: data.title,
      description: data.description ?? "",
      isPublished: data.isPublished ?? false,
    },
  });

  const { mutateAsync: updateVideo } = useMutation(
    trpc.lms.video.update.mutationOptions({
      async onSuccess(data) {
        toast.info("Details updated");
        await queryClient.invalidateQueries(
          trpc.lms.video.getById.queryOptions({ videoId }),
        );
        if (data)
          form.reset({
            title: data.title,
            description: data.description ?? "",
            isPublished: data.isPublished ?? false,
          });
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof UpdateVideoSchema>) {
    await updateVideo({ ...values, videoId });
  }

  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center"></div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex w-full justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Video details
          </h3>

          <div className="space-x-3">
            <Button
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              variant={"secondary"}
              className="rounded-full"
              onClick={() => form.reset()}
              type="button"
              size={"lg"}
            >
              Discard changes
            </Button>
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isDirty}
              className="rounded-full"
              size={"lg"}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="grid w-full grid-cols-8 gap-6">
          <div className="col-span-5 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Title (required)"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Title of the video"
                      {...field}
                      maxLength={100}
                      className="resize-none"
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
                  <FormLabel>{"Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add description..."
                      maxLength={5000}
                      className="h-80 resize-none"
                    />
                  </FormControl>
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
                    If the video is public then users can able to access it from
                    chapter.
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
          </div>
          <div className="col-span-3">
            {data.playbackId && (
              <MuxPlayer
                playbackId={data.playbackId}
                accentColor="#ffb203"
                className="w-full"
                metadataVideoTitle={data.title}
                metadataVideoId={data.id}
                loading="page"
                style={{ aspectRatio: 16 / 9 }}
              />
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
