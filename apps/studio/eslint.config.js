import baseConfig, { restrictEnvAccess } from "@instello/eslint-config/base";
import nextjsConfig from "@instello/eslint-config/nextjs";
import reactConfig from "@instello/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
