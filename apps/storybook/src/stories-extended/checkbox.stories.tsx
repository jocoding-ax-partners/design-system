import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox, Label } from "@heroui/react";

export default {
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  title: "Checkbox",
} as Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

export const Sizes: Story = {
  render: () => (
    <div className={"space-y-3"}>
      <div className="flex items-center gap-6">
        <Checkbox id="size-sm">
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-sm">Small</Label>
          </Checkbox.Content>
        </Checkbox>

        <Checkbox id="size-md">
          <Checkbox.Control data-size="md">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-md">Medium</Label>
          </Checkbox.Content>
        </Checkbox>
      </div>

      <div className="flex items-center gap-6">
        <Checkbox id="size-sm" isIndeterminate={true}>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-sm">Small</Label>
          </Checkbox.Content>
        </Checkbox>

        <Checkbox id="size-md" isIndeterminate={true}>
          <Checkbox.Control data-size="md">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-md">Medium</Label>
          </Checkbox.Content>
        </Checkbox>
      </div>

      <div className="flex items-center gap-6">
        <Checkbox id="size-sm">
          <Checkbox.Control data-rounded="true">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-sm">Small</Label>
          </Checkbox.Content>
        </Checkbox>

        <Checkbox id="size-md">
          <Checkbox.Control data-rounded="true" data-size="md">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-md">Medium</Label>
          </Checkbox.Content>
        </Checkbox>
      </div>

      <div className="flex items-center gap-6">
        <Checkbox id="size-sm" isIndeterminate={true}>
          <Checkbox.Control data-rounded="true">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-sm">Small</Label>
          </Checkbox.Content>
        </Checkbox>

        <Checkbox id="size-md" isIndeterminate={true}>
          <Checkbox.Control data-rounded="true" data-size="md">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="size-md">Medium</Label>
          </Checkbox.Content>
        </Checkbox>
      </div>
    </div>
  ),
};
