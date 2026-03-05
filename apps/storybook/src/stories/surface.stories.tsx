import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input, Label, Surface, TextField } from "@shared/ui";

const meta: Meta<typeof Surface> = {
  argTypes: {},
  component: Surface,
  parameters: {
    layout: "centered",
  },
  title: "Components/Layout/Surface",
};

export default meta;
type Story = StoryObj<typeof Surface>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-muted text-sm font-medium">Transparent</p>
        <Surface
          className="flex min-w-[320px] flex-col gap-3 rounded-3xl border p-6"
          variant="transparent"
        >
          <h3 className="text-foreground text-base font-semibold">Surface Content</h3>
          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input className="w-[280px]" placeholder="john@example.com" />
          </TextField>
          <p className="text-muted text-sm">
            This is a default surface variant. It uses bg-surface styling.
          </p>
        </Surface>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted text-sm font-medium">Default</p>
        <Surface className="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="default">
          <h3 className="text-foreground text-base font-semibold">Surface Content</h3>
          <TextField isRequired name="email" type="email" variant="secondary">
            <Label>Email</Label>
            <Input className="border-border/20 w-[280px] border" placeholder="john@example.com" />
          </TextField>
          <p className="text-muted text-sm">
            This is a default surface variant. It uses bg-surface styling.
          </p>
        </Surface>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted text-sm font-medium">Secondary</p>
        <Surface className="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="secondary">
          <h3 className="text-foreground text-base font-semibold">Surface Content</h3>
          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input className="w-[280px]" placeholder="john@example.com" />
          </TextField>
          <p className="text-muted text-sm">
            This is a secondary surface variant. It uses bg-surface-secondary styling.
          </p>
        </Surface>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted text-sm font-medium">Tertiary</p>
        <Surface className="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="tertiary">
          <h3 className="text-foreground text-base font-semibold">Surface Content</h3>
          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input className="w-[280px]" placeholder="john@example.com" />
          </TextField>
          <p className="text-muted text-sm">
            This is a tertiary surface variant. It uses bg-surface-tertiary styling.
          </p>
        </Surface>
      </div>
    </div>
  ),
};
