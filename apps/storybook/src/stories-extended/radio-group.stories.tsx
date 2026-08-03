import type { Meta, StoryObj } from "@storybook/react-vite";

import { Description, Label, Radio, RadioGroup } from "@heroui/react";

export default {
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  title: "Components/RadioGroup",
} as Meta<typeof RadioGroup>;

type Story = StoryObj<typeof RadioGroup>;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 px-4">
      <RadioGroup defaultValue="option1" name="size-sm">
        <Label>Small (default)</Label>
        <Radio value="option1">
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label>Option 1</Label>
            <Description>Small radio option</Description>
          </Radio.Content>
        </Radio>
        <Radio value="option2">
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label>Option 2</Label>
            <Description>Small radio option</Description>
          </Radio.Content>
        </Radio>
      </RadioGroup>

      <RadioGroup defaultValue="option1" name="size-md">
        <Label>Medium</Label>
        <Radio value="option1">
          <Radio.Control data-size="md">
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label>Option 1</Label>
            <Description>Medium radio option</Description>
          </Radio.Content>
        </Radio>
        <Radio value="option2">
          <Radio.Control data-size="md">
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label>Option 2</Label>
            <Description>Medium radio option</Description>
          </Radio.Content>
        </Radio>
      </RadioGroup>
    </div>
  ),
};
