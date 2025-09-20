import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
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
  // ...rest of your channels
];

export default function Home() {
  return (
    <View className="bg-background flex-1 p-4 pt-0">
      <FlashList
        data={channels}
        keyExtractor={(item) => item.id}
        renderItem={({ item: channel }) => (
          <Card
            key={channel.id}
            className="mt-3.5 flex-row items-center gap-0 p-2.5"
          >
            <Image
              source={{ uri: channel.thumbneilUrl }}
              contentFit="cover"
              style={{ height: 80, width: 112, borderRadius: 8 }}
            />
            <CardContent className="flex-1 gap-1.5">
              <CardTitle numberOfLines={1}>{channel.title}</CardTitle>
              <Text variant="muted" className="text-xs">
                {channel.numberOfChapters} Chapters
              </Text>
              <Text className="text-muted-foreground mt-auto text-xs">
                by {channel.createdByUser.firstName}{" "}
                {channel.createdByUser.lastName}
              </Text>
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
}
