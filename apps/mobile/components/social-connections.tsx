import React, { useCallback, useEffect } from "react";
import { Image, Platform, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSSO } from "@clerk/clerk-expo";
import { OAuthStrategy } from "@clerk/types";
import { useColorScheme } from "nativewind";

import { Text } from "./ui/text";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

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

export function SocialConnections() {
  useWarmUpBrowser();

  const { colorScheme } = useColorScheme();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOAuthSignIn = useCallback(async (strategy: OAuthStrategy) => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      console.log("created session id", createdSessionId);

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log("O-Auth successfull");
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
        console.log("Missing steps to be done");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, []);

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
