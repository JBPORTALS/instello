import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChannelLessonsList } from "@/components/channel-lessons-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ExapandableText from "@/components/ui/expandable-text";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { formatDuration } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CardsThreeIcon,
  ClockIcon,
} from "phosphor-react-native";

export default function ChannelDetailsScreen() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-3.5"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <ChannelDetailsSection />
        <ChannelLessonsList channelId={channelId} />
      </ScrollView>
    </>
  );
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

function ChannelDetailsSection() {
  const router = useRouter();
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  console.log(channelId);
  const {
    data: channel,
    isLoading,
    isError,
    error,
  } = useQuery(trpc.lms.channel.getById.queryOptions({ channelId }));

  if (isError)
    return (
      <View>
        <Text variant={"lead"}>Something went wrong!</Text>
        <Text variant={"muted"}>{error?.message}</Text>
      </View>
    );

  return (
    <>
      <ImageBackground
        source={{
          uri: `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${channel?.thumbneilId}`,
        }}
        style={{ height: "auto", width: "auto", aspectRatio: 16 / 10 }}
        contentFit="cover"
        placeholder={{ blurhash }}
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.2)",
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0)",
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
                  className="size-5 text-white"
                  weight="duotone"
                />
              </Button>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {isLoading ? (
        <View className="gap-2.5 px-4">
          <Skeleton className={"h-4 w-[90%]"} />
          <View className="flex-row items-center gap-1">
            <Icon
              as={ClockIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Skeleton className={"h-2 w-8"} />
            <Text variant={"muted"}>·</Text>
            <Icon
              as={CardsThreeIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Skeleton className={"h-2 w-8"} />
            <Text variant={"muted"}>·</Text>
            <Skeleton className={"h-2 w-8"} />
          </View>

          <View className="gap-1.5">
            <Skeleton className={"h-2.5 w-full"} />
            <Skeleton className={"h-2.5 w-3/4"} />
          </View>

          <View className="flex-row items-center gap-2.5 py-1.5">
            <Skeleton className={"size-6 rounded-full"} />
            <Skeleton className={"h-3 w-20"} />
          </View>
        </View>
      ) : (
        <View className="gap-2.5 px-4">
          <Text
            variant={"h4"}
            className="leading-2.5 font-medium tracking-wide"
          >
            {channel?.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon
              as={ClockIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Text variant={"muted"} className="text-xs">
              {channel && formatDuration(channel.totalDuration)}
            </Text>
            <Text variant={"muted"}>·</Text>
            <Icon
              as={CardsThreeIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Text variant={"muted"} className="text-xs">
              {channel?.numberOfChapters} Chapters
            </Text>
            <Text variant={"muted"}>·</Text>
            <Text variant={"muted"} className="text-xs">
              {channel && format(channel.createdAt, "MMM yyyy")}
            </Text>
          </View>

          {channel?.description && (
            <ExapandableText variant={"muted"}>
              {channel.description}
            </ExapandableText>
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
      )}
    </>
  );
}
