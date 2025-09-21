import React from "react";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { HouseIcon, ListBulletsIcon } from "phosphor-react-native";

export default function _layout() {
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
