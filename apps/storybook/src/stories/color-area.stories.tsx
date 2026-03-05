import type { ColorAreaRootProps } from "@heroui/react";
import type { Meta } from "@storybook/react-vite";

import { ColorSwatch } from "@heroui/react";
import { parseColor } from "@heroui/react";

import { ColorArea } from "@heroui/react";

export default {
  argTypes: {
    showDots: {
      control: "boolean",
    },
  },
  component: ColorArea,
  parameters: {
    layout: "centered",
  },
  title: "ColorArea",
} as Meta<typeof ColorArea>;

const defaultArgs: ColorAreaRootProps = {
  showDots: false,
};

const Template = (props: ColorAreaRootProps) => (
  <div className="w-[300px]">
    <ColorArea {...props}>
      <ColorArea.Thumb />
    </ColorArea>
  </div>
);

const WithDotsTemplate = (props: ColorAreaRootProps) => (
  <div className="w-[300px]">
    <ColorArea {...props} showDots>
      <ColorArea.Thumb />
    </ColorArea>
  </div>
);

const ControlledTemplate = (_props: ColorAreaRootProps) => {
  const [color, setColor] = React.useState(parseColor("hsl(50, 100%, 50%)"));

  return (
    <div className="flex w-full flex-col gap-4">
      <ColorArea value={color} onChange={setColor}>
        <ColorArea.Thumb />
      </ColorArea>
      <p className="text-muted w-full min-w-[300px] text-sm">
        Current color: <span className="font-medium">{color.toString("hsl")}</span>
      </p>
    </div>
  );
};

const ColorChannelsTemplate = (_props: ColorAreaRootProps) => (
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-2">
      <p className="text-muted text-sm font-medium">HSB: Saturation vs Brightness (default)</p>
      <ColorArea defaultValue="hsl(30, 100%, 50%)">
        <ColorArea.Thumb />
      </ColorArea>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-muted text-sm font-medium">RGB: Red vs Green</p>
      <ColorArea defaultValue="rgb(255, 100, 50)" xChannel="red" yChannel="green">
        <ColorArea.Thumb />
      </ColorArea>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-muted text-sm font-medium">RGB: Blue vs Green</p>
      <ColorArea defaultValue="rgb(50, 100, 255)" xChannel="blue" yChannel="green">
        <ColorArea.Thumb />
      </ColorArea>
    </div>
  </div>
);

const DisabledTemplate = (_props: ColorAreaRootProps) => (
  <div className="w-[300px]">
    <ColorArea isDisabled defaultValue="hsl(200, 100%, 50%)">
      <ColorArea.Thumb />
    </ColorArea>
  </div>
);

const WithColorPreviewTemplate = (_props: ColorAreaRootProps) => {
  const [color, setColor] = React.useState(parseColor("hsl(200, 100%, 50%)"));

  return (
    <div className="flex min-w-[300px] flex-col gap-4">
      <ColorArea showDots value={color} onChange={setColor}>
        <ColorArea.Thumb />
      </ColorArea>
      <div className="flex items-center gap-3">
        <ColorSwatch color={color.toString("css")} size="lg" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{color.toString("hsl")}</span>
          <span className="text-muted text-xs">{color.toString("hex")}</span>
        </div>
      </div>
    </div>
  );
};

export const Default = {
  args: defaultArgs,
  render: Template,
};

export const WithDots = {
  args: defaultArgs,
  render: WithDotsTemplate,
};

export const Controlled = {
  args: defaultArgs,
  render: ControlledTemplate,
};

export const ColorChannels = {
  args: defaultArgs,
  render: ColorChannelsTemplate,
};

export const Disabled = {
  args: defaultArgs,
  render: DisabledTemplate,
};

export const WithColorPreview = {
  args: defaultArgs,
  render: WithColorPreviewTemplate,
};
