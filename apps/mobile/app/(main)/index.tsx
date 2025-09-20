import React from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth, useSignIn } from "@clerk/clerk-expo";

export default function Home() {
  const { signOut } = useAuth();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home</Text>
      <Button onPress={() => signOut()}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
