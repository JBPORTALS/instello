import React from "react";
import { ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";

const channels = [
  {
    id: "1",
    title: "Artificial Intelligence",
    createdAt: new Date("2024-12-10T10:15:00Z"),
    createdByUser: {
      firstName: "Instello",
      lastName: "Company",
      imageUrl: "https://github.com/x-sss-x.png",
    },
    numberOfChapters: 2,
    thumbneilUrl: "https://picsum.photos/seed/ai/400/200",
  },
  {
    id: "2",
    title: "Web Development Bootcamp",
    createdAt: new Date("2024-11-20T08:30:00Z"),
    createdByUser: {
      firstName: "John",
      lastName: "Doe",
      imageUrl: "https://github.com/mdo.png",
    },
    numberOfChapters: 12,
    thumbneilUrl: "https://picsum.photos/seed/webdev/400/200",
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    createdAt: new Date("2024-10-05T14:45:00Z"),
    createdByUser: {
      firstName: "Jane",
      lastName: "Smith",
      imageUrl: "https://github.com/octocat.png",
    },
    numberOfChapters: 8,
    thumbneilUrl: "https://picsum.photos/seed/dsa/400/200",
  },
];

function ChannelCard({
  channel,
  className,
}: {
  channel: (typeof channels)[0];
  className?: string;
}) {
  return (
    <Card
      key={channel.id}
      className={cn("w-40 gap-3 border-0 p-2.5", className)}
    >
      <Image
        source={{ uri: channel.thumbneilUrl }}
        style={{
          width: "auto",
          height: 80,
          borderRadius: 4,
        }}
        contentFit="cover"
      />
      <CardContent className="w-full flex-1 gap-1.5 px-0">
        <CardTitle numberOfLines={1} className="text-sm">
          {channel.title}
        </CardTitle>
        <Text variant="muted" className="text-xs">
          {channel.numberOfChapters} Chapters
        </Text>
        <Text className="text-muted-foreground text-xs">
          by {channel.createdByUser.firstName} {channel.createdByUser.lastName}
        </Text>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName=" p-4"
      keyboardDismissMode="interactive"
    >
      {/* Section 1: Subscribed Channels */}
      <Text variant={"lead"} className=". mb-3 text-base font-semibold">
        My Subscribed Channels
      </Text>
      <FlashList
        horizontal
        data={channels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChannelCard channel={item} />}
      />

      {/* Section 2: Continue Watching */}
      <Text variant={"lead"} className="mb-3 mt-6 text-base font-semibold">
        Continue Watching
      </Text>
      <FlashList
        horizontal
        data={channels}
        keyExtractor={(item) => item.id + "_continue"}
        renderItem={({ item }) => <ChannelCard channel={item} />}
      />

      {/* Section 3: Recommended (Vertical Grid/List) */}
      <Text variant={"lead"} className="mb-3 mt-6 text-base font-semibold">
        Recommended For You
      </Text>
      <FlashList
        numColumns={2}
        data={channels}
        keyExtractor={(item) => item.id + "_recommended"}
        renderItem={({ item }) => (
          <ChannelCard className="w-full" channel={item} />
        )}
      />
    </ScrollView>
  );
}
