import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useVideoPrefetch } from "@/hooks/useVideoPrefetch";
import { cn } from "@/lib/utils";
import { queryClient, RouterOutputs, trpc } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { BookOpenTextIcon } from "phosphor-react-native";

function ChannelCard({
  channel,
  className,
}: {
  channel: RouterOutputs["lms"]["channel"]["listPublic"][number];
  className?: string;
}) {
  return (
    <Link href={`/channel?channelId=${channel.id}`} asChild>
      <TouchableOpacity>
        <Card
          key={channel.id}
          className={cn(
            "w-40 gap-3 border-0 bg-transparent p-2 shadow-none",
            className,
          )}
        >
          <Image
            source={{
              uri: `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${channel.thumbneilId}`,
            }}
            style={{
              width: "auto",
              height: "auto",
              borderRadius: 8,
              aspectRatio: 16 / 10,
            }}
            contentFit="cover"
          />
          <CardContent className="w-full flex-1 gap-0.5 px-0">
            <CardTitle numberOfLines={1} className="text-sm">
              {channel.title}
            </CardTitle>
            <Text
              variant="muted"
              className="text-muted-foreground text-xs font-semibold"
            >
              {channel.numberOfChapters} Chapters
            </Text>
            <Text className="text-muted-foreground text-xs">
              by {channel.createdByClerkUser.firstName}{" "}
              {channel.createdByClerkUser.lastName} ·{" "}
              {formatDate(channel.createdAt, "MMM yyyy")}
            </Text>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </Link>
  );
}

function ChannelCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-40 gap-3 border-0 p-2", className)}>
      <Skeleton
        style={{
          width: "auto",
          height: "auto",
          borderRadius: 8,
          aspectRatio: 16 / 10,
        }}
      />
      <CardContent className="w-full flex-1 gap-1 px-0">
        <Skeleton className="h-2.5 max-w-full" />
        <Skeleton className="h-1.5 w-32" />
        <Skeleton className="h-1.5 w-20" />
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { data, isLoading } = useQuery(
    trpc.lms.channel.listPublic.queryOptions(),
  );
  const { prefetchVideos } = useVideoPrefetch();

  const channelList = data ?? [];

  // Prefetch videos for the first few channels when they load
  React.useEffect(() => {
    if (channelList.length > 0) {
      // Prefetch videos for the first 3 channels to improve perceived performance
      const firstThreeChannels = channelList.slice(0, 3);

      firstThreeChannels.forEach(async (channel) => {
        try {
          // Prefetch videos for this channel using query client
          await queryClient.prefetchQuery(
            trpc.lms.video.listPublicByChannelId.queryOptions({
              channelId: channel.id,
            }),
          );
        } catch (error) {
          // Silently fail - this is just prefetching
          console.warn("Failed to prefetch videos for channel:", channel.id);
        }
      });
    }
  }, [channelList, prefetchVideos]);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-3.5"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
    >
      <FlashList
        numColumns={2}
        data={channelList}
        ListHeaderComponent={
          <Text
            variant={"lead"}
            className="px-2 py-1.5 text-base font-semibold"
          >
            Recommended for You
          </Text>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="w-full flex-1 flex-row flex-wrap">
              {Array.from({ length: 8 }).map((_, i) => (
                <ChannelCardSkeleton className="w-1/2" key={i} />
              ))}
            </View>
          ) : (
            <View className="h-52 flex-1 items-center justify-center gap-2.5">
              <Icon
                as={BookOpenTextIcon}
                size={52}
                weight="duotone"
                className="text-muted-foreground"
              />
              <Text variant={"large"}>Comming Soon</Text>
              <Text variant={"muted"} className="text-center">
                We are excited to share some cool content based channels with
                you soon. Please wait for some time in while we are making
                things faster to reach out to you.
              </Text>
            </View>
          )
        }
        keyExtractor={(item) => item.id + "_recommended"}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => (
          <ChannelCard className={cn("w-full")} channel={item} />
        )}
      />
    </ScrollView>
  );
}
