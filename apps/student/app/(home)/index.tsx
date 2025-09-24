import * as React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { signOut } = useAuth();
  return (
    <>
      <Stack.Screen />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Text>Welcome to Instello</Text>
        <Button onPress={() => signOut()}>
          <Text>Sign out</Text>
        </Button>
      </View>
    </>
  );
}
