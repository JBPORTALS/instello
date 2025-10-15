import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...reactPlugin.configs.recommended,
    ...reactPlugin.configs["jsx-runtime"],
    languageOptions: {
      ...reactPlugin.configs.all,
      ...reactPlugin.configs["jsx-runtime"],
      globals: {
        React: "writable",
      },
    },
  },
  reactHooks.configs.flat["recommended-latest"]!,
);
