import baseConfig from "@instello/eslint-config/base";
import reactConfig from "@instello/eslint-config/react";
import storybook from "eslint-plugin-storybook";

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
/** @type {import('typescript-eslint').Config} */
const eslintConfig = [
  ...storybook.configs["flat/recommended"],
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];

export default eslintConfig;
