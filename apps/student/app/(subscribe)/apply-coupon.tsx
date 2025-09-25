import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Image } from "expo-image";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import LottieView from "lottie-react-native";
import { useColorScheme } from "nativewind";

export default function ApplyCouponScreen() {
  const { colorScheme } = useColorScheme();
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
