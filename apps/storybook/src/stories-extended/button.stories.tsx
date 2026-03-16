import type { Meta } from "@storybook/react-vite";

import { Button } from "@heroui/react";

export default {
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
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

export const Soft = {
  args: { size: "md" },
  render: ({ isDisabled, size }: Button["RootProps"]) => (
    <div className="flex gap-3">
      <Button data-soft="true" isDisabled={isDisabled} size={size}>
        Primary
      </Button>
    </div>
  ),
};

export const Outline = {
  args: { size: "md" },
  render: ({ isDisabled, size }: Button["RootProps"]) => (
    <div className="flex gap-3">
      <Button data-color="accent" isDisabled={isDisabled} size={size} variant="outline">
        Accent
      </Button>
      <Button data-color="danger" isDisabled={isDisabled} size={size} variant="outline">
        Danger
      </Button>
      <Button data-color="success" isDisabled={isDisabled} size={size} variant="outline">
        Success
      </Button>
      <Button data-color="warning" isDisabled={isDisabled} size={size} variant="outline">
        Warning
      </Button>
    </div>
  ),
};

export const Ghost = {
  args: { size: "md" },
  render: ({ isDisabled, size }: Button["RootProps"]) => (
    <div className="flex gap-3">
      <Button data-color="accent" isDisabled={isDisabled} size={size} variant="ghost">
        Accent
      </Button>
      <Button data-color="danger" isDisabled={isDisabled} size={size} variant="ghost">
        Danger
      </Button>
      <Button data-color="success" isDisabled={isDisabled} size={size} variant="ghost">
        Success
      </Button>
      <Button data-color="warning" isDisabled={isDisabled} size={size} variant="ghost">
        Warning
      </Button>
    </div>
  ),
};
