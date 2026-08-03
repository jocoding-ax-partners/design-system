import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip, type ChipProps } from "@heroui/react";

export default {
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  component: Chip,
  parameters: {
    layout: "centered",
  },
  title: "Components/Chip",
} as Meta<typeof Chip>;

type Story = StoryObj<typeof Chip>;

const variants = ["primary", "secondary", "tertiary", "soft"] as const;
const colors = ["accent", "default", "success", "warning", "danger"] as const;

/**
 * `info` is not part of HeroUI's `color` prop, so it is opted in via `data-color="info"`.
 */
export const InfoColor: Story = {
  args: { size: "md" },
  render: ({ size }: ChipProps) => (
    <div className="flex items-center gap-3">
      {variants.map((variant) => (
        <Chip key={variant} data-color="info" size={size} variant={variant}>
          <Chip.Label className="capitalize">{variant}</Chip.Label>
        </Chip>
      ))}
    </div>
  ),
};

/**
 * `color` and `data-color` may be combined; `data-color` wins by specificity.
 * Every chip below should render as `info`, not as its `color` prop.
 */
export const InfoOverridesColorProp: Story = {
  args: { size: "md" },
  render: ({ size }: ChipProps) => (
    <div className="flex flex-col gap-3">
      {variants.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <div className="text-muted w-24 shrink-0 text-sm capitalize">{variant}</div>
          {colors.map((color) => (
            <Chip key={color} color={color} data-color="info" size={size} variant={variant}>
              <Chip.Label className="capitalize">{color}</Chip.Label>
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
};
