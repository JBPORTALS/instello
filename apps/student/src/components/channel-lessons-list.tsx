import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useVideoPrefetch } from "@/hooks/useVideoPrefetch";
import { formatDuration } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon, LockLaminatedIcon } from "phosphor-react-native";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Icon } from "./ui/icon";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./ui/text";

export function ChannelLessonsList({ channelId }: { channelId: string }) {
  const { data: videos, isLoading } = useQuery(
    trpc.lms.video.listPublicByChannelId.queryOptions({ channelId }),
  );
  const { prefetchVideo, prefetchVideos } = useVideoPrefetch();

  // Prefetch all video details when the channel videos are loaded
  React.useEffect(() => {
    if (videos && Array.isArray(videos)) {
      const videoIds = videos
        .filter(
          (item): item is NonNullable<typeof item> & { id: string } =>
            typeof item === "object" &&
            "canWatch" in item &&
            "id" in item &&
            item.canWatch,
        )
        .map((item) => item.id);

      if (videoIds.length > 0) {
        prefetchVideos(videoIds);
      }
    }
  }, [videos, prefetchVideos]);

  if (isLoading) {
    return (
      <View className="px-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} className="mb-2.5">
            <View className="bg-accent/40 flex-row gap-2 rounded-md p-2">
              <Skeleton
                className="h-14 w-[120px] rounded-md"
                style={{ height: 64, width: 120, borderRadius: 8 }}
              />
              <View className="flex-1 justify-center gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  const hasLessons = Array.isArray(videos)
    ? videos.some((item) => typeof item !== "string")
    : false;

  if (!hasLessons) {
    return (
      <View className="px-4 py-6">
        <View className="bg-accent/30 items-center justify-center rounded-md p-6">
          <Text variant="large" className="mb-1 text-base font-medium">
            No lessons yet
          </Text>
          <Text
            variant="muted"
            className="text-muted-foreground text-center text-sm"
          >
            Lessons will appear here when this channel adds content.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlashList
      data={videos ?? []}
      contentContainerClassName="px-4"
      ItemSeparatorComponent={() => <View className="h-2.5 w-full" />}
      renderItem={({ item }) => {
        if (typeof item === "string") {
          // Rendering header
          return (
            <Text variant={"large"} className="text-base font-medium">
              {item}
            </Text>
          );
        } else {
          // Render item
          return (
            <Link
              asChild
              href={`/video?playbackId=${item.playbackId}&videoId=${item.id}`}
              disabled={!item.canWatch}
            >
              <TouchableOpacity
                onPress={() => {
                  if (item.canWatch) {
                    prefetchVideo(item.id);
                  }
                }}
              >
                <Card className="bg-accent/40 flex-row gap-2 p-2">
                  <CardContent className="p-0">
                    <Image
                      source={{
                        uri: `https://image.mux.com/${item.playbackId}/thumbnail.png?width=214&height=121&time=15`,
                      }}
                      className="bg-accent h-14 w-auto rounded-sm p-0"
                      style={{
                        height: 64,
                        width: "auto",
                        aspectRatio: 16 / 11,
                        borderRadius: 8,
                      }}
                    />
                  </CardContent>
                  <CardHeader className="flex-1 justify-center pl-0">
                    <CardTitle
                      numberOfLines={2}
                      className="w-full text-sm font-medium"
                    >
                      {item.title}
                    </CardTitle>
                    <View className="flex-row items-center gap-1">
                      <Icon
                        as={ClockIcon}
                        weight="duotone"
                        className="text-muted-foreground"
                      />

                      <Text
                        variant={"muted"}
                        className="text-muted-foreground text-xs"
                      >
                        {formatDuration(item.duration ?? 0)}
                      </Text>
                    </View>
                  </CardHeader>
                  {!item.canWatch && (
                    <CardFooter>
                      <Icon
                        weight="duotone"
                        as={LockLaminatedIcon}
                        className="text-muted-foreground"
                      />
                    </CardFooter>
                  )}
                </Card>
              </TouchableOpacity>
            </Link>
          );
        }
      }}
      getItemType={(item) => {
        // To achieve better performance, specify the type based on the item
        return typeof item === "string" ? "sectionHeader" : "row";
      }}
    />
  );
}
