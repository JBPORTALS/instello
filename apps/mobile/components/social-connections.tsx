import React from "react";
import { Alert, Image, Platform, View } from "react-native";
import * as Linking from "expo-linking";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSSO } from "@clerk/clerk-expo";
import { OAuthStrategy } from "@clerk/types";
import { useColorScheme } from "nativewind";

import { Text } from "./ui/text";

const SOCIAL_CONNECTION_STRATEGIES: {
  type: OAuthStrategy;
  strategy: OAuthStrategy;
  source: { uri: string };
  useTint: boolean;
  title: string;
}[] = [
  {
    type: "oauth_google",
    strategy: "oauth_google",
    source: { uri: "https://img.clerk.com/static/google.png?width=160" },
    useTint: false,
    title: "Continue with Google",
  },
];

const redirectUrl = Linking.createURL("/", {
  scheme: "instello",
  isTripleSlashed: true,
});

export function SocialConnections() {
  const { colorScheme } = useColorScheme();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = React.useState(false);

  console.log(`Redirect Url: `, redirectUrl);

  const handleOAuthSignIn = async (strategy: OAuthStrategy) => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (createdSessionId && setActive) {
        await setActive({
          session: createdSessionId,
          redirectUrl,
        });
        // Navigation will be handled by the auth state in _layout.tsx
      }
    } catch (err: any) {
      console.error("OAuth error:", err);
      Alert.alert(
        "Authentication Failed",
        err.errors?.[0]?.message ||
          "An error occurred during authentication. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            className="sm:flex-1"
            onPress={() => handleOAuthSignIn(strategy.strategy)}
            disabled={isLoading}
          >
            <Image
              className={cn(
                "size-4",
                strategy.useTint && Platform.select({ web: "dark:invert" }),
              )}
              tintColor={Platform.select({
                native: strategy.useTint
                  ? colorScheme === "dark"
                    ? "white"
                    : "black"
                  : undefined,
              })}
              source={strategy.source}
            />
            <Text>{isLoading ? "Signing in..." : strategy.title}</Text>
          </Button>
        );
      })}
    </View>
  );
}
