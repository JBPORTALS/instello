import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, scheme } = getConfig();

  return {
    ...config,
    name,
    slug: "instello",
    version: "1.0.0",
    owner: "tech.jbportals.team",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: scheme,
    },
    android: {
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: scheme,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      eas: {
        projectId: "055c4f68-c31e-41fe-bca2-8f4a15b5af71",
      },
    },
    plugins: [
      "expo-router",
      "expo-web-browser",
      "expo-secure-store",
      [
        "expo-screen-orientation",
        {
          initialOrientation: "DEFAULT",
        },
      ],
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#232323",
          image: "./assets/images/splash-icon.png",
          dark: {
            image: "./assets/images/splash-icon-dark.png",
            backgroundColor: "#000000",
          },
          imageWidth: 200,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};

function getConfig() {
  switch (process.env.APP_ENV) {
    case "development":
      return {
        name: "instello (Dev)",
        scheme: "in.instello.dev",
      };
    case "preview":
      return {
        name: "instello (Preview)",
        scheme: "in.instello.preview",
      };
    case "production":
      return {
        name: "instello",
        scheme: "in.instello.app",
      };
    default:
      return {
        name: "instello",
        scheme: "in.instello.app",
      };
  }
}
