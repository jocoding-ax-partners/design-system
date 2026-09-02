import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../dist/styles/index.css", import.meta.url), "utf8");

test("caption-01 uses the AxHub line height of 1.4", () => {
  assert.match(css, /--text-caption-01--line-height:\s*1\.4\b/);
});

test("status colors ship a -strong step for text on light surfaces", () => {
  assert.match(css, /--danger-strong:/);
  assert.match(css, /--success-strong:/);
  assert.match(css, /--info-strong:\s*#0f5fcc\b/);
});

test("dark mode redefines status base colors, not just the soft steps", () => {
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(darkBlock, /--success:\s*#3ddb78\b/);
  assert.match(darkBlock, /--warning:\s*#ffe246\b/);
  assert.match(darkBlock, /--danger:\s*#ff4759\b/);
  assert.match(darkBlock, /--info:\s*#4d94fb\b/);
});

test("semantic surface, foreground and border tokens ship", () => {
  for (const t of [
    "--bg-surface",
    "--bg-content",
    "--bg-muted",
    "--bg-emphasis",
    "--bg-inverse",
    "--fg-default",
    "--fg-secondary",
    "--fg-muted",
    "--fg-subtle",
    "--fg-disabled",
    "--fg-inverse",
    "--border-default",
    "--border-strong",
    "--border-interactive",
    "--border-divider",
  ]) {
    assert.match(css, new RegExp(`${t.replace(/-/g, "\\-")}:`), `missing ${t}`);
  }
});

test("dark inverts the surface hierarchy — bg-surface floats above bg-content", () => {
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(darkBlock, /--bg-surface:\s*#25272d\b/);
  assert.match(darkBlock, /--bg-content:\s*#1d1e23\b/);
});

test("opacity ladders ship for both gray and white, 10 steps each", () => {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  for (const s of steps) {
    assert.match(css, new RegExp(`\\-\\-opacity\\-gray\\-${s}:`), `missing --opacity-gray-${s}`);
    assert.match(css, new RegExp(`\\-\\-opacity\\-white\\-${s}:`), `missing --opacity-white-${s}`);
  }
});

test("responsive container padding tokens ship", () => {
  for (const t of ["sm", "md", "lg", "xl", "2xl"]) {
    assert.match(css, new RegExp(`\\-\\-container\\-pad\\-${t}:`), `missing --container-pad-${t}`);
  }
});

test("dark surface step tokens ship with their kit values", () => {
  assert.match(css, /--dark-surface:\s*#25272d/);
  assert.match(css, /--dark-content:\s*#1d1e23/);
  assert.match(css, /--dark-muted:\s*#16171b/);
  assert.match(css, /--dark-emphasis:\s*#3f3f46/);
});

test("opacity ladder alphas match the design kit", () => {
  const alphas = {
    50: 3,
    100: 8,
    200: 16,
    300: 28,
    400: 36,
    500: 48,
    600: 60,
    700: 70,
    800: 80,
    900: 90,
  };
  for (const [step, pct] of Object.entries(alphas)) {
    assert.match(
      css,
      new RegExp(`--opacity-gray-${step}:\\s*rgb\\(24 24 27 / ${pct}%\\)`),
      `--opacity-gray-${step} should be ${pct}%`,
    );
    assert.match(
      css,
      new RegExp(`--opacity-white-${step}:\\s*rgb\\(255 255 255 / ${pct}%\\)`),
      `--opacity-white-${step} should be ${pct}%`,
    );
  }
});

// NOTE: `@utility` declarations survive the artifact as `@utility <name> {`, not
// as a `.<name>` class selector — this build is postcss-import only, it never
// runs Tailwind's utility-generation pass that would turn `@utility` into an
// actual `.<name>` rule scoped to used classes. Confirmed by reading
// packages/heroui/dist/styles/index.css directly.
test("semantic typography utilities ship", () => {
  for (const u of [
    "t-page-title",
    "t-section-title",
    "t-card-title",
    "t-body",
    "t-body-strong",
    "t-small",
    "t-button",
    "t-caption",
  ]) {
    assert.match(css, new RegExp(`@utility ${u}\\b`), `missing @utility ${u}`);
  }
});

test("px-container ramps across all five breakpoints", () => {
  assert.match(css, /@utility px-container\b/);
  for (const bp of ["768px", "1024px", "1280px", "1536px"]) {
    assert.ok(css.includes(bp), `missing breakpoint ${bp}`);
  }
});
