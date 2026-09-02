import type { Meta, StoryObj } from "@storybook/react-vite";

const BACKGROUNDS = ["surface", "content", "muted", "emphasis", "inverse"] as const;
const FOREGROUNDS = ["default", "secondary", "muted", "subtle", "disabled", "inverse"] as const;
const BORDERS = ["default", "strong", "interactive", "divider"] as const;

function Palette({ theme }: { theme: "light" | "dark" }) {
  return (
    <div data-theme={theme} style={{ padding: 24, background: "var(--bg-content)" }}>
      <p style={{ color: "var(--fg-default)", fontWeight: 700 }}>{theme}</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {BACKGROUNDS.map((b) => (
          <div key={b} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 96,
                height: 48,
                background: `var(--bg-${b})`,
                border: "1px solid var(--border-default)",
              }}
            />
            <small style={{ color: "var(--fg-muted)" }}>bg-{b}</small>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        {FOREGROUNDS.map((f) => (
          <p key={f} style={{ color: `var(--fg-${f})`, margin: "2px 0" }}>
            fg-{f} — 이 줄이 읽히는가
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {BORDERS.map((b) => (
          <div
            key={b}
            style={{
              width: 96,
              height: 48,
              border: `1px solid var(--border-${b})`,
              color: "var(--fg-muted)",
              fontSize: 12,
            }}
          >
            border-{b}
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Extended/Surface tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const LightAndDark: StoryObj = {
  render: () => (
    <>
      <Palette theme="light" />
      <Palette theme="dark" />
    </>
  ),
};
