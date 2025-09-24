import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function MainLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} withAnchor />;

  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
  );
}
