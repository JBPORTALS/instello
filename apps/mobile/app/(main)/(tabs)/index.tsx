import React from "react";
import { ScrollView } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
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
    <Link href={"/(stacks)/v/2"}>
      <Card
        key={channel.id}
        className={cn("w-40 gap-3 border-0 p-2", className)}
      >
        <Image
          source={{ uri: channel.thumbneilUrl }}
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
          <Text variant="muted" className="text-xs">
            {channel.numberOfChapters} Chapters
          </Text>
          <Text className="text-muted-foreground text-xs">
            by {channel.createdByUser.firstName}{" "}
            {channel.createdByUser.lastName}
          </Text>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-3.5"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
    >
      <FlashList
        numColumns={2}
        data={channels}
        ListHeaderComponent={
          <Text
            variant={"lead"}
            className="px-2 py-1.5 text-base font-semibold"
          >
            All by Instello Studio
          </Text>
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
