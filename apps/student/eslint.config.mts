import baseConfig from "@instello/eslint-config/base";
import reactConfig from "@instello/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
);
