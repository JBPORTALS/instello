import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="c/[channelId]" options={{ headerShown: false }} />
    </Stack>
  );
}
