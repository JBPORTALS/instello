import React from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { trpc } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { TicketIcon } from "phosphor-react-native";

export default function SubscribeScreen() {
  return (
    <>
      <StatusBar style="auto" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-3.5 px-4"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <SubscribeToChannelForm />
      </ScrollView>
    </>
  );
}

function SubscribeToChannelForm() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const [code, setCode] = React.useState("");
  const router = useRouter();
  const {
    mutate: checkCoupon,
    isPending,
    isError,
    error,
    reset,
  } = useMutation(
    trpc.lms.coupon.check.mutationOptions({
      onSuccess(coupon) {
        router.replace(
          `/(subscribe)/apply-coupon?couponId=${coupon.id}&channelId=${channelId}`,
        );
      },
    }),
  );

  return (
    <View className="items-center gap-3.5 px-6">
      <View className="bg-muted size-20 items-center justify-center rounded-full">
        <Icon as={TicketIcon} className="text-muted-foreground size-8" />
      </View>
      <Label>Enter your coupon code</Label>
      <Input
        value={code}
        onChangeText={(code) => {
          reset();
          setCode(code);
        }}
        autoCapitalize="characters"
        textAlign="center"
        className="h-12 rounded-2xl text-lg"
      />
      {isError && (
        <Text className="text-destructive text-xs">{error.message}</Text>
      )}
      <Button
        disabled={!code || isPending}
        variant={"secondary"}
        className="w-full"
        size={"lg"}
        onPress={() => checkCoupon({ code, channelId })}
      >
        <Text>{isPending ? "Verifying..." : "Apply"}</Text>
      </Button>
      <Text variant={"muted"} className="text-center text-xs">
        By continuing you will agree to our future terms & conditions related to
        coupon related subscriptions.
      </Text>

      <Text className="text-muted-foreground/60" variant={"muted"}>
        Powered by JB Portals
      </Text>
    </View>
  );
}
