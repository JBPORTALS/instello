import "../global.css";

import React, { useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/useColorScheme";
import { queryClient } from "@/utils/api";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { IconContext } from "phosphor-react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
  }

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

    if (isColorSchemeLoaded) SplashScreen.hide();
  }, [isColorSchemeLoaded]);

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      touchSession
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}
        >
          <IconContext.Provider
            value={{
              weight: "duotone",
              size: 16,
            }}
          >
            <Slot />
            <PortalHost />
          </IconContext.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
