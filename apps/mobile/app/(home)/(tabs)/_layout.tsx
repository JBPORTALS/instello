import React from "react";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-expo";
import { HouseIcon, ListBulletsIcon } from "phosphor-react-native";

export default function _layout() {
  const { user } = useUser();
  return (
    <Tabs screenOptions={{ headerShadowVisible: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          headerTitle: () => (
            <Image
              source={require("assets/images/instello.png")}
              style={{ width: 90, height: 20 }}
            />
          ),

          tabBarIcon: ({ size, focused }) => (
            <Icon
              as={HouseIcon}
              size={size}
              className={cn(focused ? "text-primary" : "text-muted-foreground")}
              weight={focused ? "fill" : "duotone"}
            />
          ),

          headerRight: () => (
            <Avatar alt="User Image" className="mr-4">
              <AvatarImage source={{ uri: user?.imageUrl }} />
              <AvatarFallback>
                <Text className="font-semibold">
                  {user?.firstName?.charAt(0)}
                </Text>
              </AvatarFallback>
            </Avatar>
          ),
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: "Subscriptions",
          tabBarIcon: ({ size, focused }) => (
            <Icon
              as={ListBulletsIcon}
              size={size}
              className={cn(focused ? "text-primary" : "text-muted-foreground")}
              weight={focused ? "bold" : "duotone"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
