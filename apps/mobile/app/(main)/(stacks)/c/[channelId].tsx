import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { trpc } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowArcLeftIcon,
  ArrowLeftIcon,
  BooksIcon,
  CardsThreeIcon,
  ClockClockwiseIcon,
  ClockIcon,
} from "phosphor-react-native";

export default function ChannelDetailsScreen() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  console.log(channelId);
  const {
    data: channel,
    isLoading,
    isError,
    error,
  } = useQuery(trpc.lms.channel.getById.queryOptions({ channelId }));

  const router = useRouter();

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={32} />
      </View>
    );

  if (isError || !channel)
    return (
      <View>
        <Text variant={"lead"}>Something went wrong!</Text>
        <Text variant={"muted"}>{error?.message}</Text>
      </View>
    );

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-3.5"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={{
          uri: `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${channel?.thumbneilId}`,
        }}
        style={{ height: "auto", width: "auto", aspectRatio: 16 / 10 }}
        contentFit="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.5)",
            "rgba(0,0,0,0.5)",
            "rgba(0,0,0,0.5)",
            "rgba(0,0,0,0.6)",
            "rgba(0,0,0,0.95)",
          ]}
          style={{
            width: "auto",
            height: "100%",
          }}
        >
          <View className="pt-safe flex-1 px-4">
            <View className="justify-between py-4">
              <Button
                onPress={() => router.back()}
                size={"icon"}
                variant={"outline"}
                className="size-11 rounded-full bg-transparent"
              >
                <Icon
                  as={ArrowLeftIcon}
                  className="text-secondary-foreground size-5"
                  weight="duotone"
                />
              </Button>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View className="gap-2.5 px-4">
        <Text variant={"h4"} className="leading-2.5 font-medium tracking-wide">
          {channel?.title}
        </Text>
        <View className="flex-row items-center gap-1">
          <Icon
            as={ClockIcon}
            weight="duotone"
            className="text-muted-foreground"
          />

          <Text variant={"muted"} className="text-xs">
            {channel.numberOfChapters}h 30 min
          </Text>
          <Text variant={"muted"}>·</Text>
          <Icon
            as={CardsThreeIcon}
            weight="duotone"
            className="text-muted-foreground"
          />

          <Text variant={"muted"} className="text-xs">
            {channel.numberOfChapters} Chapters
          </Text>
          <Text variant={"muted"}>·</Text>
          <Text variant={"muted"} className="text-xs">
            {format(channel.createdAt, "MMM yyyy")}
          </Text>
        </View>

        {channel?.description && (
          <Text variant={"muted"} numberOfLines={2}>
            {channel.description}
          </Text>
        )}

        <View className="flex-row items-center gap-2.5 py-1.5">
          <Avatar
            alt={`${channel?.createdByClerkUser.firstName}'s Logo`}
            className="size-6"
          >
            <AvatarImage
              source={{ uri: channel?.createdByClerkUser.imageUrl }}
            />
            <AvatarFallback>
              <Text>{channel?.createdByClerkUser.firstName?.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>
          <Text variant={"small"}>
            {channel?.createdByClerkUser.firstName}{" "}
            {channel?.createdByClerkUser.lastName}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
