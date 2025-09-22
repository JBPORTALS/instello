import {
  Slot,
  SplashScreen,
  Stack,
  useFocusEffect,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { resourceCache } from "@clerk/clerk-expo/resource-cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";

import "../global.css";

import React, { useCallback, useEffect } from "react";
import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/useColorScheme";
import { queryClient } from "@/utils/api";
import { ClerkLoaded, ClerkProvider, useUser } from "@clerk/clerk-expo";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { IconContext } from "phosphor-react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need

function InitialLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");

      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";

      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }

      setIsColorSchemeLoaded(true);
    })();
  }, [isSignedIn, isLoaded, isColorSchemeLoaded]);

  useFocusEffect(
    useCallback(() => {
      if (isLoaded) {
        const isAuthSegment = segments["0"] === "(auth)";
        const isMainSegment = segments["0"] === "(main)";

        if (
          isSignedIn &&
          isAuthSegment &&
          user.publicMetadata.onBoardingCompleted
        ) {
          router.replace("/(main)/(tabs)");
        } else if (
          isSignedIn &&
          (isMainSegment || isAuthSegment) &&
          !user.publicMetadata.onBoardingCompleted
        ) {
          router.replace("/(onboarding)");
        } else if (!isSignedIn) {
          router.replace("/(auth)");
        }

        if (isColorSchemeLoaded) SplashScreen.hideAsync();
      }
    }, [isLoaded, isSignedIn, isColorSchemeLoaded]),
  );

  return (
    <ThemeProvider value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}>
      <StatusBar style={"auto"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkColorScheme
              ? NAV_THEME.dark.colors.background
              : NAV_THEME.light.colors.background,
          },
        }}
        initialRouteName="(main)"
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await resourceCache().get(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await resourceCache().set(key, "");
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return resourceCache().set(key, value);
      } catch (err) {
        return;
      }
    },
  };

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <IconContext.Provider
            value={{
              weight: "duotone",
              size: 16,
            }}
          >
            <InitialLayout />
            <PortalHost />
          </IconContext.Provider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
