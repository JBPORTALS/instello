import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "../components/button";

const meta = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Get Started",
  },
};

export const Secondary: Story = {
  args: {
    children: "Get Started",
    variant: "secondary",
  },
};
