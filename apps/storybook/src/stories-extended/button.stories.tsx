import type { Meta } from "@storybook/react-vite";

import { Button } from "@heroui/react";

export default {
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "outline", "ghost", "danger"],
    },
  },
  component: Button,
  parameters: {
    layout: "centered",
  },
  title: "Button",
} as Meta<typeof Button>;

export const Softened = {
  args: { size: "md" },
  render: ({ size }: Button["RootProps"]) => (
    <div className="flex gap-3">
      <Button data-softened="true" size={size}>
        Primary
      </Button>
    </div>
  ),
};

export const SoftenedDisabled = {
  args: { size: "md" },
  render: ({ size }: Button["RootProps"]) => (
    <div className="flex gap-3">
      <Button isDisabled data-softened="true" size={size}>
        Primary
      </Button>
    </div>
  ),
};
