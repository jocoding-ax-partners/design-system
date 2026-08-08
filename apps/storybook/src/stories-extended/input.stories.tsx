import type { Meta, StoryObj } from "@storybook/react-vite";

import { cn, Input, Surface } from "@heroui/react";

export default {
  component: Input,
  parameters: {
    layout: "centered",
  },
  title: "Components/Input",
} as Meta<typeof Input>;

type Story = StoryObj<typeof Input>;

const SURFACES = ["default", "secondary", "tertiary", "transparent"] as const;

const DisabledColumn = ({ disabled }: { disabled: boolean }) => (
  <div className="flex flex-col gap-3">
    <p className="text-muted text-xs font-medium">{disabled ? "Disabled" : "Enabled"}</p>
    <Input className="w-full" disabled={disabled} placeholder="Your name" variant="primary" />
    <Input className="w-full" defaultValue="Filled value" disabled={disabled} variant="primary" />
    <Input className="w-full" disabled={disabled} placeholder="Your name" variant="secondary" />
    <Input className="w-full" defaultValue="Filled value" disabled={disabled} variant="secondary" />
  </div>
);

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {SURFACES.map((surface) => (
        <div className="flex flex-col gap-2" key={surface}>
          <p className="text-muted text-sm font-medium">
            {surface.charAt(0).toUpperCase() + surface.slice(1)} Surface
          </p>
          <Surface
            className={cn(
              "grid min-w-[520px] grid-cols-2 gap-4 rounded-3xl p-6",
              surface === "transparent" && "border",
            )}
            variant={surface}
          >
            <DisabledColumn disabled={false} />
            <DisabledColumn disabled={true} />
          </Surface>
        </div>
      ))}
    </div>
  ),
};
