import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(home)/(tabs)"} withAnchor />;
  }

  return <Stack screenOptions={{ headerShadowVisible: false }} />;
}
