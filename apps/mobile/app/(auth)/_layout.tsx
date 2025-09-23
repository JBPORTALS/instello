import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(main)/(tabs)"} />;
  }

  return (
    <Stack screenOptions={{ headerShadowVisible: false, animation: "fade" }} />
  );
}
