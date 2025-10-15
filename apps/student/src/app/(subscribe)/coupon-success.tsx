import React from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { trpc } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import LottieView from "lottie-react-native";

export default function CouponSuccessScreen() {
  const { errorMessage, subscriptionId } = useLocalSearchParams<{
    errorMessage?: string;
    subscriptionId?: string;
  }>();

  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery(
    trpc.lms.subscription.getById.queryOptions(
      { subscriptionId: subscriptionId! },
      { enabled: !!subscriptionId },
    ),
  );

  if (errorMessage || isError || !data)
    return (
      <View>
        <Text variant={"large"}>{errorMessage ?? error?.message}</Text>
      </View>
    );

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="flex-1 items-center"
    >
      <View className="w-full flex-1 items-center gap-3.5 px-6">
        <LottieView
          source={require("assets/animations/shine-crown.json")}
          style={{ height: 200, width: 200 }}
          autoPlay
        />
        <View className="flex-1">
          <Text variant={"h3"}>Subscribed Successful</Text>
          <Text variant={"muted"}>Happy learning</Text>
        </View>
        {isLoading ? (
          <Skeleton className={"h-20 w-full"} />
        ) : (
          <Card className="bg-accent/40 flex-row gap-0 p-2">
            <CardContent className="h-full p-0">
              <Image
                source={{
                  uri: `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${data?.channel?.thumbneilId}`,
                }}
                style={{
                  height: 64,
                  width: "auto",
                  aspectRatio: 16 / 11,
                  borderRadius: 8,
                }}
              />
            </CardContent>
            <CardHeader className="px-2">
              <CardTitle numberOfLines={2} className="text-sm">
                {data?.channel?.title}
              </CardTitle>
              <CardDescription>
                Expires on {data?.endDate && format(data.endDate, "PP")}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        <Button
          variant={"secondary"}
          onPress={() => router.back()}
          className="w-full"
        >
          <Text>Okay, Got it</Text>
        </Button>
      </View>
    </Animated.View>
  );
}
