import { View } from "react-native";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function GetStarted() {
  return (
    <View className="flex-1 items-center justify-between gap-6 px-6 py-8">
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={require("assets/images/instello.png")}
        style={{ height: 80, width: 140 }}
        contentFit="contain"
        transition={200}
        useAppleWebpCodec
        importantForAccessibility="yes"
      />

      <View className="bg-accent border-border size-32 items-center justify-center rounded-2xl border shadow-lg">
        <Image
          source={require("assets/images/instello-feather.png")}
          style={{ height: 100, width: 100 }}
          contentFit="contain"
          transition={200}
          useAppleWebpCodec
          importantForAccessibility="yes"
        />
      </View>

      <View className="gap-3.5">
        <Text variant={"h1"} className="max-w-sm text-center font-medium">
          One Platform. Every Possibility.
        </Text>
        <Text variant={"lead"} className="text-center">
          Learn anywhere. Teach better. Manage with ease.
        </Text>
      </View>

      <View className="w-full gap-3.5">
        <Text variant={"muted"} className="text-center">
          by continuing you'll accept all our terms and conditions
        </Text>
        <Link asChild href={"/(auth)/sign-in"}>
          <Button className="w-full" variant={"secondary"} size={"lg"}>
            <Text>Sign in</Text>
          </Button>
        </Link>
        <Link asChild href={"/(auth)/sign-up"}>
          <Button className="w-full" size={"lg"}>
            <Text>Get Started</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
