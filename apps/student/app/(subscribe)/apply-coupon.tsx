import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { trpc } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LottieView from "lottie-react-native";

export default function ApplyCouponScreen() {
  const { couponId } = useLocalSearchParams<{ couponId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createSubscription } = useMutation(
    trpc.lms.subscription.create.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(trpc.lms.channel.getById.queryFilter({ channelId: data.channelId! }));
        await queryClient.invalidateQueries(trpc.lms.video.listPublicByChannelId.queryFilter({channelId:data.channelId!}));
        router.replace(`/coupon-success?subscriptionId=${data.id}`);
      },
      onError(error) {
        router.replace(`/coupon-success?errorMessage=${error.message}`);
      },
    }),
  );

  React.useEffect(() => {
    createSubscription({ couponId });
  }, []);

  return (
    <View className="flex-1 items-center justify-between py-20">
      <Image
        source={require("assets/images/instello.png")}
        style={{ height: 24, width: 110 }}
      />
      <View className="items-center gap-3.5">
        <LottieView
          source={require("assets/animations/coupon-loading.json")}
          style={{ height: 80, width: 80 }}
          autoPlay
        />
        <Text variant={"muted"}>Applying coupon. Please wait...</Text>
        <Text variant={"muted"} className="text-xs">
          Don't press back button or close the app
        </Text>
      </View>

      <Text variant={"muted"}>Powered by JB Portals</Text>
    </View>
  );
}
