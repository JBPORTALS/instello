import type { Preview } from "@storybook/nextjs";
import type { Renderer } from "storybook/internal/types";
import { withThemeByClassName } from "@storybook/addon-themes";

import "@instello/ui/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName<Renderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
