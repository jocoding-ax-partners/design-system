import type { Meta, StoryObj } from "@storybook/react-vite";

import { useLayoutEffect, useRef, useState } from "react";

export default {
  parameters: { layout: "padded" },
  title: "Foundations/Colors",
} as Meta;

type Story = StoryObj;

/**
 * Upstream values are pinned literals, copied from the installed packages:
 * `tailwindcss/theme.css` and `@heroui/styles` themes/default/variables.css.
 * They are here so the comparison keeps showing what we moved away from —
 * refresh them when either dependency is bumped.
 *
 * Our side is never pinned. Every swatch resolves against the live stylesheet,
 * so this story cannot drift from what the tokens actually are.
 */
const HEROUI_FOREGROUND = "oklch(0.2103 0.0059 285.89)";
const HEROUI_ACCENT = "oklch(0.6204 0.195 253.83)";
const HEROUI_DANGER = "oklch(0.6532 0.2328 25.74)";
const HEROUI_SUCCESS = "oklch(0.7329 0.1935 150.81)";
const HEROUI_WARNING = "oklch(0.7819 0.1585 72.33)";

/**
 * The `bg-*` classes have to be written out. Tailwind drops `@theme` variables
 * that no utility references, so building the class name at runtime would leave
 * half the palette undefined and every swatch transparent.
 */
const GRAY_ROWS = [
  { name: "gray-50", ourClass: "bg-gray-50", upstream: "oklch(98.5% 0.002 247.839)" },
  { name: "gray-100", ourClass: "bg-gray-100", upstream: "oklch(96.7% 0.003 264.542)" },
  { name: "gray-200", ourClass: "bg-gray-200", upstream: "oklch(92.8% 0.006 264.531)" },
  { name: "gray-300", ourClass: "bg-gray-300", upstream: "oklch(87.2% 0.01 258.338)" },
  { name: "gray-400", ourClass: "bg-gray-400", upstream: "oklch(70.7% 0.022 261.325)" },
  { name: "gray-500", ourClass: "bg-gray-500", upstream: "oklch(55.1% 0.027 264.364)" },
  { name: "gray-600", ourClass: "bg-gray-600", upstream: "oklch(44.6% 0.03 256.802)" },
  { name: "gray-700", ourClass: "bg-gray-700", upstream: "oklch(37.3% 0.034 259.733)" },
  { name: "gray-800", ourClass: "bg-gray-800", upstream: "oklch(27.8% 0.033 256.848)" },
  { name: "gray-900", ourClass: "bg-gray-900", upstream: "oklch(21% 0.034 264.665)" },
  { name: "gray-950", ourClass: "bg-gray-950", upstream: "oklch(13% 0.028 261.692)" },
];

/**
 * Semantic tokens are plain declarations in `@layer base`, not `@theme` keys, so
 * reading them through `var()` is safe here.
 */
const SEMANTIC_ROWS = [
  { name: "--background", upstream: "oklch(0.9702 0 0)" },
  { name: "--border", upstream: "oklch(90% 0.004 286.32)" },
  { name: "--default", upstream: "oklch(94% 0.001 286.375)" },
  { name: "--muted", upstream: "oklch(0.5517 0.0138 285.94)" },
  { name: "--accent", upstream: HEROUI_ACCENT },
  { name: "--danger", upstream: HEROUI_DANGER },
  { name: "--success", upstream: HEROUI_SUCCESS },
  { name: "--warning", upstream: HEROUI_WARNING },
  { name: "--info", upstream: null },
  {
    name: "--accent-soft-foreground",
    upstream: `color-mix(in oklab, ${HEROUI_ACCENT} 70%, ${HEROUI_FOREGROUND} 30%)`,
  },
  {
    name: "--danger-soft-foreground",
    upstream: `color-mix(in oklab, ${HEROUI_DANGER} 70%, ${HEROUI_FOREGROUND} 40%)`,
  },
  {
    name: "--success-soft-foreground",
    upstream: `color-mix(in oklab, ${HEROUI_SUCCESS} 80%, ${HEROUI_FOREGROUND} 60%)`,
  },
  {
    name: "--warning-soft-foreground",
    upstream: `color-mix(in oklab, ${HEROUI_WARNING} 80%, ${HEROUI_FOREGROUND} 70%)`,
  },
  { name: "--info-soft-foreground", upstream: null },
];

/**
 * Both columns arrive in whatever syntax they were authored in — hex on our
 * side, `oklch()` and `color-mix()` upstream — which makes them impossible to
 * read against each other. Painting a pixel gives one comparable sRGB value.
 * Out-of-gamut colors clamp, same as they would on screen.
 */
function toHex(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return color;
  }

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  if (a === 0) {
    return "정의되지 않음";
  }

  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function Swatch({ className, value }: { className?: string; value?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hex, setHex] = useState("");

  useLayoutEffect(() => {
    if (ref.current) {
      setHex(toHex(getComputedStyle(ref.current).backgroundColor));
    }
  }, [className, value]);

  return (
    <div className="flex items-center gap-3">
      <span
        ref={ref}
        className={`border-border size-14 shrink-0 rounded-lg border ${className ?? ""}`}
        style={value ? { background: value } : undefined}
      />
      <code className="text-xs">{hex}</code>
    </div>
  );
}

function ComparisonTable({
  caption,
  ourValue,
  rows,
  upstreamLabel,
}: {
  caption: string;
  rows: Array<{ name: string; ourClass?: string; upstream: string | null }>;
  upstreamLabel: string;
  ourValue: (row: { name: string; ourClass?: string }) => { className?: string; value?: string };
}) {
  return (
    <table className="w-full max-w-3xl border-collapse text-left">
      <caption className="text-muted mb-3 text-left text-sm">{caption}</caption>
      <thead>
        <tr className="border-border border-b">
          <th className="text-muted py-2 pr-4 text-xs font-medium">토큰</th>
          <th className="text-muted py-2 pr-4 text-xs font-medium">{upstreamLabel}</th>
          <th className="text-muted py-2 text-xs font-medium">demodev</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name} className="border-border border-b">
            <td className="py-2 pr-4">
              <code className="text-xs">{row.name}</code>
            </td>
            <td className="py-2 pr-4">
              {row.upstream ? (
                <Swatch value={row.upstream} />
              ) : (
                <span className="text-muted text-xs">없음</span>
              )}
            </td>
            <td className="py-2">
              <Swatch {...ourValue(row)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * `gray-950` is the control row: we never redefined it, so both columns should
 * report the same hex. Every other step should differ.
 */
export const Gray: Story = {
  render: () => (
    <ComparisonTable
      caption="Tailwind 기본 gray 팔레트와 colors.css 에서 재정의한 값"
      ourValue={(row) => ({ className: row.ourClass })}
      rows={GRAY_ROWS}
      upstreamLabel="Tailwind"
    />
  ),
};

/**
 * Light mode only. The overrides are scoped to
 * `:root:not(.dark, [data-theme="dark"])`, so switching the theme makes the
 * right column fall back to HeroUI's dark values while the left column keeps
 * showing pinned light ones.
 */
export const Semantic: Story = {
  render: () => (
    <ComparisonTable
      caption="HeroUI 시맨틱 토큰 기본값과 colors.css / index.css 에서 덮어쓴 값 (라이트 모드)"
      ourValue={(row) => ({ value: `var(${row.name})` })}
      rows={SEMANTIC_ROWS}
      upstreamLabel="HeroUI"
    />
  ),
};
