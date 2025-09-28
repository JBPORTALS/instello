import React from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { VideoSource } from "expo-video";
import { NativeVideo } from "@/components/native-video";
import { Text } from "@/components/ui/text";
import { RouterOutputs, trpc } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Mux } from "mux-embed";
import { CalendarIcon, ClockIcon } from "phosphor-react-native";

export default function VideoScreen() {
  const { videoId, playbackId } = useLocalSearchParams<{
    videoId: string;
    playbackId: string;
  }>();

  const {
    data: video,
    isLoading,
    error,
    isFetching,
  } = useQuery(
    trpc.lms.video.getById.queryOptions({
      videoId: videoId!,
    }),
  );

  const videoSource: VideoSource = {
    uri: `https://stream.mux.com/${playbackId}.m3u8`,
    metadata: {
      title: video?.title,
      artist: video?.chapter?.title,
    },
  };

  // Custom Mux analytics options
  const muxOptions: Parameters<Mux["init"]>[1] = {
    data: {
      env_key: process.env.EXPO_PUBLIC_MUX_ENV_KEY,
      player_name: "Instello - Mobile Player",
      player_version: "1.0.0",
      video_id: videoId,
      video_title: video?.title,
      video_series: video?.chapter?.title,
      video_duration: video?.duration ? video.duration * 1000 : undefined, // Convert to milliseconds
      video_stream_type: "on-demand",
      // Add custom metadata
      custom_1: video?.chapter?.title, // Chapter name
    },
  };

  return (
    <>
      <StatusBar style="auto" />
      <NativeVideo className="pt-safe flex-1">
        <NativeVideo.Player
          videoId={videoId}
          videoSource={videoSource}
          muxOptions={muxOptions}
        />
        <NativeVideo.Content className="flex-1">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="gap-3.5 p-4"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
          >
            <VideoDetails
              isLoading={isLoading && !video}
              isFetching={isFetching}
              error={error}
              video={video}
            />
          </ScrollView>
        </NativeVideo.Content>
      </NativeVideo>
    </>
  );
}

interface VideoDetailsProps {
  isLoading: boolean;
  isFetching?: boolean;
  error: any;
  video?: RouterOutputs["lms"]["video"]["getById"];
}

function VideoDetails({
  isLoading,
  isFetching,
  error,
  video,
}: VideoDetailsProps) {
  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Unknown date";
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return <VideoDetailsSkeleton />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-destructive text-center">
          Failed to load video details. Please try again.
        </Text>
      </View>
    );
  }

  if (!video) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-muted-foreground text-center">
          Video not found.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {/* Video Title */}
      <View className="items-start gap-3">
        <View className="bg-muted rounded-full px-2 py-1">
          <Text className="text-muted-foreground text-xs">
            {video.chapter.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-foreground text-xl font-bold">
            {video.title}
          </Text>
          {isFetching && <View className="bg-accent h-2 w-2 rounded-full" />}
        </View>
      </View>

      {/* Video Stats */}
      <View className="flex-row flex-wrap items-center gap-4">
        <View className="flex-row items-center gap-1">
          <ClockIcon weight="duotone" size={16} color="#6B7280" />
          <Text className="text-muted-foreground text-sm">
            {formatDuration(video.duration)}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <CalendarIcon weight="duotone" size={16} color="#6B7280" />
          <Text className="text-muted-foreground text-sm">
            {formatDate(video.createdAt)}
          </Text>
        </View>
      </View>

      {/* Description */}
      {video.description && (
        <View className="gap-2">
          <Text className="text-foreground text-base font-semibold">
            Description
          </Text>
          <Text className="text-muted-foreground text-sm leading-5">
            {video.description}
          </Text>
        </View>
      )}
    </View>
  );
}

function VideoDetailsSkeleton() {
  return (
    <View className="gap-4">
      {/* Title Skeleton */}
      <View className="gap-3">
        <View className="bg-muted h-6 w-3/4 rounded-md" />
      </View>

      {/* Stats Skeleton */}
      <View className="flex-row items-center gap-4">
        <View className="bg-muted h-4 w-12 rounded-md" />
        <View className="bg-muted h-4 w-20 rounded-md" />
      </View>

      {/* Description Skeleton */}
      <View className="gap-2">
        <View className="bg-muted h-5 w-24 rounded-md" />
        <View className="gap-2">
          <View className="bg-muted h-4 w-full rounded-md" />
          <View className="bg-muted h-4 w-full rounded-md" />
          <View className="bg-muted h-4 w-3/4 rounded-md" />
        </View>
      </View>
    </View>
  );
}
