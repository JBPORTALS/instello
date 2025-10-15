import * as React from "react";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const fullName = user?.fullName || user?.username || "Unknown";
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress;
  const imageSource = user?.imageUrl ? { uri: user.imageUrl } : undefined;
  const initials = React.useMemo(() => {
    const name = fullName || email || "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }, [fullName, email]);

  async function handleLogout() {
    await signOut();
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <View className="flex-1 p-4">
      <View className="items-center gap-3 py-6">
        <Avatar className="size-24" alt={`${fullName}'s avatar`}>
          <AvatarImage source={imageSource} />
          <AvatarFallback>
            <Text className="text-2xl font-semibold">{initials}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="items-center">
          <Text className="text-lg font-semibold">{fullName}</Text>
          {email ? (
            <Text variant="muted" className="text-muted-foreground text-sm">
              {email}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="gap-3">
        <Button
          onPress={handleLogout}
          size="lg"
          variant={"secondary"}
          className="w-full"
        >
          <Text>Log out</Text>
        </Button>
      </View>
    </View>
  );
}
