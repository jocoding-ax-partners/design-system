import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleButton } from "@heroui/react";
import { Icon } from "@iconify/react";

export default {
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  component: ToggleButton,
  parameters: {
    layout: "centered",
  },
  title: "Components/ToggleButton",
} as Meta<typeof ToggleButton>;

type Story = StoryObj<typeof ToggleButton>;

type Color = "accent" | "danger" | "success" | "warning" | "info";

const colors: Color[] = ["accent", "danger", "success", "warning", "info"];

type ColorRowProps = ToggleButton["RootProps"] & { color?: Color };

const ColorRow = ({ color, isDisabled, size, variant }: ColorRowProps) => (
  <div className="flex items-center gap-3">
    <div className="text-muted w-20 shrink-0 text-sm capitalize">{color ?? "none"}</div>
    <ToggleButton data-color={color} isDisabled={isDisabled} size={size} variant={variant}>
      <Icon icon="gravity-ui:heart" />
      Like
    </ToggleButton>
    <ToggleButton
      defaultSelected
      data-color={color}
      isDisabled={isDisabled}
      size={size}
      variant={variant}
    >
      <Icon icon="gravity-ui:heart-fill" />
      Like
    </ToggleButton>
  </div>
);

/**
 * `data-color` tints the selected state only. The `none` row must match `accent`.
 */
export const DefaultColors: Story = {
  args: { size: "md" },
  render: ({ isDisabled, size }: ToggleButton["RootProps"]) => (
    <div className="flex flex-col gap-3">
      <ColorRow isDisabled={isDisabled} size={size} />
      {colors.map((color) => (
        <ColorRow key={color} color={color} isDisabled={isDisabled} size={size} />
      ))}
    </div>
  ),
};

/**
 * The ghost variant uses a soft selected background with a matching border.
 */
export const GhostColors: Story = {
  args: { size: "md" },
  render: ({ isDisabled, size }: ToggleButton["RootProps"]) => (
    <div className="flex flex-col gap-3">
      <ColorRow isDisabled={isDisabled} size={size} variant="ghost" />
      {colors.map((color) => (
        <ColorRow key={color} color={color} isDisabled={isDisabled} size={size} variant="ghost" />
      ))}
    </div>
  ),
};
