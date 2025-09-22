import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
  );
}
