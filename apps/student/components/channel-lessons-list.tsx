import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { formatDuration } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon } from "phosphor-react-native";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function ChannelLessonsList({ channelId }: { channelId: string }) {
  const { data: videos } = useQuery(
    trpc.lms.video.listPublicByChannelId.queryOptions({ channelId }),
  );

  return (
    <FlashList
      data={videos}
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
            >
              <TouchableOpacity>
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
