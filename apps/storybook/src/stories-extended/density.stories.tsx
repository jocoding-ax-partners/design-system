import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Chip, Input, TextField } from "@heroui/react";

const ROWS = [
  { name: "김한결", score: 92, status: "합격" },
  { name: "이도현", score: 68, status: "재응시" },
  { name: "박서윤", score: 81, status: "합격" },
];

function Panel({ density }: { density?: "compact" }) {
  return (
    <section
      data-density={density}
      style={{
        padding: 24,
        background: "var(--bg-content)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <p className="t-section-title" style={{ marginTop: 0 }}>
        {density ?? "default"}
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <Button size="sm" data-testid={`btn-sm-${density ?? "default"}`}>
          채점
        </Button>
        <Button size="md">저장</Button>
        <Chip size="sm">진행중</Chip>
        <TextField aria-label="검색">
          <Input placeholder="응시자 검색" />
        </TextField>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["응시자", "점수", "판정"].map((h) => (
              <th
                key={h}
                className="t-caption"
                data-testid={`th-${density ?? "default"}`}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--border-default)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.name}>
              {[r.name, r.score, r.status].map((c, i) => (
                <td
                  key={i}
                  className="t-small"
                  data-testid={`td-${density ?? "default"}`}
                  style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-divider)" }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const meta = {
  title: "Extended/Density",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const DefaultVsCompact: StoryObj = {
  render: () => (
    <>
      <Panel />
      <Panel density="compact" />
    </>
  ),
};
