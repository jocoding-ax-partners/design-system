import type { Meta, StoryObj } from "@storybook/react-vite";

import { useEffect, useState } from "react";

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const CHART = ["1", "2", "3", "4", "5", "6", "7", "8", "other"] as const;
const TENANTS = { 기본: "", 그린: "#0f9d58", 퍼플: "#6d28d9" } as const;

function Ramp() {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {STEPS.map((s) => (
        <div key={s} style={{ textAlign: "center", fontSize: 11 }}>
          <div style={{ width: 48, height: 40, background: `var(--color-primary-${s})` }} />
          {s}
        </div>
      ))}
    </div>
  );
}

function Chart() {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {CHART.map((n) => (
        <div key={n} style={{ textAlign: "center", fontSize: 11 }}>
          <div style={{ width: 48, height: 40, background: `var(--chart-${n})` }} />
          {n}
        </div>
      ))}
    </div>
  );
}

/* The tenant rule lives on `:root`, so the story sets the attribute on <html> and
   restores it on unmount. */
function TenantBrand() {
  const [tenant, setTenant] = useState<keyof typeof TENANTS>("기본");
  useEffect(() => {
    const root = document.documentElement;
    const color = TENANTS[tenant];
    if (color) {
      root.setAttribute("data-brand-theme", tenant);
      root.style.setProperty("--primary", color);
    }
    return () => {
      root.removeAttribute("data-brand-theme");
      root.style.removeProperty("--primary");
    };
  }, [tenant]);

  return (
    <div style={{ display: "grid", gap: 16, padding: 24, fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {(Object.keys(TENANTS) as (keyof typeof TENANTS)[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTenant(t)}
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              border: "1px solid var(--border-default)",
              background: t === tenant ? "var(--primary)" : "var(--bg-content)",
              color: t === tenant ? "var(--fg-on-primary)" : "var(--fg-default)",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <Ramp />
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ padding: "6px 12px", background: "var(--primary-soft)", borderRadius: 10 }}>
          primary-soft
        </span>
        <span style={{ padding: "6px 12px", background: "var(--accent-soft)", borderRadius: 10 }}>
          accent-soft (HeroUI)
        </span>
      </div>
      <Chart />
      <p style={{ color: "var(--fg-muted)" }}>
        Pretendard — 조코딩AX파트너스 모든 제품의 기본 서체 (--font-sans)
      </p>
    </div>
  );
}

const meta = {
  title: "Extended/Brand",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const PrimaryRampAndTenant: StoryObj = {
  render: () => <TenantBrand />,
};
