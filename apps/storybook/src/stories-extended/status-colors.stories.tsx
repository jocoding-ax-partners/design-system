import type { Meta, StoryObj } from "@storybook/react-vite";

const STATUSES = ["accent", "success", "warning", "danger", "info"] as const;

function Swatches({ theme }: { theme: "light" | "dark" }) {
  return (
    <div
      data-theme={theme}
      style={{
        display: "grid",
        gap: 12,
        padding: 24,
        background: theme === "dark" ? "#16171b" : "#ffffff",
      }}
    >
      {STATUSES.map((s) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 88, color: `var(--${s}-strong, var(--${s}))` }}>{s}</span>
          <span style={{ width: 40, height: 24, background: `var(--${s})` }} />
          <span style={{ width: 40, height: 24, background: `var(--${s}-soft)` }} />
          <span style={{ color: `var(--${s}-strong, var(--${s}))` }}>
            본문 텍스트 대비 확인 — 읽히는가
          </span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Extended/Status colors",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const LightAndDark: StoryObj = {
  render: () => (
    <>
      <Swatches theme="light" />
      <Swatches theme="dark" />
    </>
  ),
};
