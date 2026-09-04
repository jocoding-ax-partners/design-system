import type { Meta, StoryObj } from "@storybook/react-vite";

const UTILITIES = [
  ["t-page-title", "페이지 제목 — Page title"],
  ["t-section-title", "섹션 제목 — Section title"],
  ["t-card-title", "카드 제목 — Card title"],
  ["t-body", "본문 — The quick brown fox jumps over the lazy dog"],
  ["t-body-strong", "본문 강조 — The quick brown fox"],
  ["t-small", "작은 본문 — Small body text"],
  ["t-button", "버튼 라벨 — Button label"],
  ["t-caption", "캡션 — Caption text"],
] as const;

const meta = {
  title: "Extended/Typography utilities",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Scale: StoryObj = {
  render: () => (
    <div style={{ padding: 32, background: "var(--bg-content)" }}>
      {UTILITIES.map(([cls, sample]) => (
        <div key={cls} style={{ marginBottom: 20 }}>
          <code style={{ color: "var(--fg-subtle)", fontSize: 11 }}>.{cls}</code>
          <p className={cls} style={{ margin: "4px 0 0" }} data-t={cls}>
            {sample}
          </p>
        </div>
      ))}
    </div>
  ),
};
