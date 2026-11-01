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

// `packages/heroui`'s build is postcss-import only (no var() resolution) — the
// `--color-*-strong` mappings must show up verbatim as `var(--*-strong)`, and
// the underlying `--*-strong` custom properties must carry the exact light and
// dark literal values (never resolve them through `var()`, see note above).
test("status -strong tokens are mapped into the --color-* namespace", () => {
  assert.match(css, /--color-success-strong:\s*var\(--success-strong\)/);
  assert.match(css, /--color-warning-strong:\s*var\(--warning-strong\)/);
  assert.match(css, /--color-danger-strong:\s*var\(--danger-strong\)/);
  assert.match(css, /--color-info-strong:\s*var\(--info-strong\)/);
});

test("status -strong tokens carry the pinned light values", () => {
  assert.match(css, /--warning-strong:\s*var\(--color-warning-700\)/);
  assert.match(css, /--info-strong:\s*#0f5fcc\b/);
  assert.match(css, /--danger-strong:\s*var\(--color-danger-700\)/);
  assert.match(css, /--success-strong:\s*var\(--color-success-700\)/);
});

test("the gray ramp owns 200, 300 and 400 instead of leaking Tailwind's defaults", () => {
  assert.match(css, /--color-gray-200:\s*oklch\(92\.8% 0\.006 266deg\)/);
  assert.match(css, /--color-gray-300:\s*oklch\(87\.2% 0\.01 267\.5deg\)/);
  assert.match(css, /--color-gray-400:\s*oklch\(66\.5% 0\.019 270deg\)/);
});

test("light soft foregrounds use the dark steps that clear AA on their -soft fill", () => {
  assert.match(css, /--accent-soft-foreground:\s*var\(--color-accent-700\)/);
  assert.match(css, /--danger-soft-foreground:\s*var\(--color-danger-800\)/);
  assert.match(css, /--success-soft-foreground:\s*var\(--color-success-800\)/);
  assert.match(css, /--warning-soft-foreground:\s*var\(--color-warning-800\)/);
  assert.match(css, /--info-soft-foreground:\s*var\(--info-strong\)/);
});

test("filled colors carry a readable label in both themes", () => {
  assert.match(css, /--color-danger-500:\s*#e60f24\b/);
  assert.match(css, /--danger:\s*var\(--color-danger-500\)/);
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(darkBlock, /--primary:\s*var\(--primary-base\)/);
  assert.match(darkBlock, /--danger-foreground:\s*var\(--eclipse\)/);
});

test("status -strong tokens carry the pinned dark values", () => {
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(darkBlock, /--success-strong:\s*#4dd488\b/);
  assert.match(darkBlock, /--warning-strong:\s*#f6c205\b/);
  assert.match(darkBlock, /--danger-strong:\s*#ff6b7a\b/);
  assert.match(darkBlock, /--info-strong:\s*#3d8df7\b/);
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

test("compact density redefines the type and padding axes", () => {
  const i = css.indexOf('[data-density="compact"]');
  assert.ok(i !== -1, 'missing [data-density="compact"] scope');
  const block = css.slice(i, i + 2000);
  assert.match(block, /--text-body-03:\s*0\.8125rem\b/); // 13px
  assert.match(block, /--text-caption-01:\s*0\.7188rem\b/); // 11.5px, rounded to 4-decimal precision
  assert.match(block, /--spacing-list-box-item:/);
  assert.match(block, /--container-pad-sm:/);
});

// `.button--sm` is defined in the heroui package (packages/heroui/src/styles/button.css),
// not in the tailwind package's density.css — the BEM class selector `.button--sm` only
// passes stylelint in the package whose config extends the BEM allowance. The compact
// restatement lives right next to it, inside the same `@layer components` block.
test("compact density restates the small-button label next to where .button--sm is defined", () => {
  const i = css.indexOf('[data-density="compact"] .button--sm');
  assert.ok(i !== -1, 'missing [data-density="compact"] .button--sm rule');
  const block = css.slice(i, i + 300);
  assert.match(block, /font-size:\s*var\(--text-caption-01\)/);
  assert.match(block, /letter-spacing:\s*var\(--text-caption-01--letter-spacing\)/);
});

test("compact density does NOT shrink button or input heights", () => {
  const i = css.indexOf('[data-density="compact"]');
  const block = css.slice(i, i + 2000);
  assert.doesNotMatch(block, /--spacing-button-(sm|md|lg):/);
  assert.doesNotMatch(block, /--spacing-input:/);
});

// Guards the top-level constraint: adding a density axis must not move a single
// pixel at the default density. `text-xs` has zero letter-spacing and
// `caption-01` has -0.01em, so swapping it in `button-size-sm` would narrow the
// small-button labels of every consumer that never opts into compact.
test("the default small-button label is untouched by the density work", () => {
  assert.match(css, /@utility button-size-sm[\s\S]{0,200}?text-xs/);
});

// `CodeBlock` reads `--syntax-*` via inline `style="color: var(--syntax-*)"` —
// this build is postcss-import only (no var() resolution, see note above), so
// the alias tokens must survive verbatim as `var(--fg-*)` in the artifact.
test("syntax highlight tokens carry the pinned light values", () => {
  assert.match(css, /--syntax-keyword:\s*#7c3aed\b/);
  assert.match(css, /--syntax-string:\s*#15803d\b/);
  assert.match(css, /--syntax-function:\s*#1d4ed8\b/);
  assert.match(css, /--syntax-number:\s*#b45309\b/);
  assert.match(css, /--syntax-comment:\s*var\(--fg-muted\)/);
  assert.match(css, /--syntax-punctuation:\s*var\(--fg-secondary\)/);
  assert.match(css, /--syntax-plain:\s*var\(--fg-default\)/);
});

test("syntax highlight tokens carry the pinned dark values", () => {
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(darkBlock, /--syntax-keyword:\s*#c4b5fd\b/);
  assert.match(darkBlock, /--syntax-string:\s*#86efac\b/);
  assert.match(darkBlock, /--syntax-function:\s*#93c5fd\b/);
  assert.match(darkBlock, /--syntax-number:\s*#fcd34d\b/);
});

// `List` and `SidePanel` read `var(--primary)` (bg-[var(--primary)] /
// bg-[color:var(--primary)]) — no stylesheet declared it before this fix, so the
// active-item bar and resize handle rendered with no color for every consumer.
test("primary ramp literals ship theme-invariant", () => {
  assert.match(css, /--primary-base:\s*#2d64fa\b/);
  assert.match(css, /--primary-bright:\s*#5985fb\b/);
  assert.match(css, /--primary-dark:\s*#4b7bff\b/);
});

test("primary semantic tokens carry the pinned light values", () => {
  assert.match(css, /--primary:\s*var\(--primary-base\)/);
  assert.match(css, /--primary-hover:\s*var\(--primary-bright\)/);
  assert.match(css, /--primary-soft:\s*#eaf0fe\b/);
  assert.match(css, /--primary-soft-hover:\s*#d6e2fd\b/);
});

test("primary semantic tokens carry the pinned dark values", () => {
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(darkBlock, /--primary:\s*var\(--primary-base\)/);
  assert.match(darkBlock, /--primary-hover:\s*var\(--color-accent-700\)/);
  assert.match(darkBlock, /--primary-soft:\s*rgb\(75 123 255 \/ 40%\)/);
  assert.match(darkBlock, /--primary-soft-hover:\s*rgb\(75 123 255 \/ 55%\)/);
});

test("primary tokens are mapped into the --color-* namespace", () => {
  assert.match(css, /--color-primary:\s*var\(--primary\)/);
  assert.match(css, /--color-primary-hover:\s*var\(--primary-hover\)/);
  assert.match(css, /--color-primary-soft:\s*var\(--primary-soft\)/);
  assert.match(css, /--color-primary-soft-hover:\s*var\(--primary-soft-hover\)/);
  assert.match(css, /--color-primary-fg:\s*var\(--primary-fg\)/);
  assert.match(css, /--color-primary-grad-from:\s*var\(--primary-grad-from\)/);
  assert.match(css, /--color-primary-grad-to:\s*var\(--primary-grad-to\)/);
});

// Surface, foreground and border tokens must be scoped to Tailwind's
// role-specific theme namespaces (`--background-color-*`, `--text-color-*`,
// `--border-color-*`), matching the axhub-frontend canon (globals.css
// L356-376) — not the generic `--color-*` namespace, which collapses
// bg/text/border into one shared utility name and (for `--color-default`)
// shadowed HeroUI's own neutral-surface token. This build is postcss-import
// only — `var()` is never resolved — so we assert the literal `var(--*)`
// string as written in source.
test("surface, foreground and border tokens are mapped into their role-scoped Tailwind namespaces", () => {
  // Background — only `bg-*`
  assert.match(css, /--background-color-surface:\s*var\(--bg-surface\)/);
  assert.match(css, /--background-color-content:\s*var\(--bg-content\)/);
  assert.match(css, /--background-color-muted:\s*var\(--bg-muted\)/);
  assert.match(css, /--background-color-emphasis:\s*var\(--bg-emphasis\)/);
  assert.match(css, /--background-color-inverse:\s*var\(--bg-inverse\)/);

  // Text — only `text-*`
  assert.match(css, /--text-color-default:\s*var\(--fg-default\)/);
  assert.match(css, /--text-color-secondary:\s*var\(--fg-secondary\)/);
  assert.match(css, /--text-color-muted:\s*var\(--fg-muted\)/);
  assert.match(css, /--text-color-subtle:\s*var\(--fg-subtle\)/);
  assert.match(css, /--text-color-disabled:\s*var\(--fg-disabled\)/);
  assert.match(css, /--text-color-inverse:\s*var\(--fg-inverse\)/);
  assert.match(css, /--text-color-on-primary:\s*var\(--fg-on-primary\)/);

  // Border — only `border-*`
  assert.match(css, /--border-color-default:\s*var\(--border-default\)/);
  assert.match(css, /--border-color-strong:\s*var\(--border-strong\)/);
  assert.match(css, /--border-color-interactive:\s*var\(--border-interactive\)/);
  assert.match(css, /--border-color-divider:\s*var\(--border-divider\)/);
});

// `--fg-on-primary` must resolve to the primary-fg token shipped in
// `eed00db` so `text-color-on-primary` has a real value to point at.
test("--fg-on-primary aliases --primary-fg", () => {
  assert.match(css, /--fg-on-primary:\s*var\(--primary-fg\)/);
});

// Regression guard: the old generic `--color-*` names for these tokens must
// not reappear in the artifact. Their reappearance would mean the namespace
// fix regressed — the `bg-bg-*` utility naming and the generic
// `--color-default` shadowing HeroUI's own neutral surface would be back.
test("the old generic --color-* surface/border names are gone", () => {
  assert.doesNotMatch(css, /--color-bg-surface:/);
  assert.doesNotMatch(css, /--color-bg-content:/);
  assert.doesNotMatch(css, /--color-bg-muted:/);
  assert.doesNotMatch(css, /--color-bg-emphasis:/);
  assert.doesNotMatch(css, /--color-bg-inverse:/);
  assert.doesNotMatch(css, /--color-border-default:/);
  assert.doesNotMatch(css, /--color-border-strong:/);
  assert.doesNotMatch(css, /--color-border-interactive:/);
  assert.doesNotMatch(css, /--color-border-divider:/);
});

// --- Shell layout / icon tokens (nav-shell promotion) -----------------------
//
// These three are owned by `packages/tailwind`, which is `private: true` and is
// never published. The only path they take to a consumer app is the dist read
// above.
//
// A source-level test for the same tokens exists at
// `packages/tailwind/src/styles/__tests__/layout-tokens.test.ts`. It cannot
// stand in for these: the layer that actually broke in the published 4.1.0 was
// the artifact, not the source — the tokens were present in source but never
// inlined into dist, and APTA rendered a 212.16px sidebar instead of 244px.
// Measure at the layer you are judging.
test("shell layout tokens reach dist — sidebar width", () => {
  assert.match(css, /--sidebar-width:\s*244px/);
});

test("shell layout tokens reach dist — topbar height", () => {
  assert.match(css, /--topbar-height:\s*60px/);
});

test("inactive nav icon color reaches dist in both themes", () => {
  assert.match(css, /--icon-inactive:\s*var\(--color-gray-300\)/);
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(darkBlock, /--icon-inactive:\s*var\(--color-gray-500\)/);
});

test("the house typeface stack ships — Pretendard first", () => {
  assert.match(css, /--font-sans:\s*"Pretendard Variable", "Pretendard"/);
  assert.match(css, /--font-mono:\s*ui-monospace/);
});

test("motion steps ship as one rhythm for every product", () => {
  assert.match(css, /--duration-fast:\s*150ms/);
  assert.match(css, /--duration-base:\s*200ms/);
  assert.match(css, /--duration-slow:\s*300ms/);
  assert.match(css, /--ease-standard:\s*cubic-bezier\(0\.4, 0, 0\.2, 1\)/);
});

test("the primary ramp names the accent ramp step for step", () => {
  for (const s of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
    assert.match(
      css,
      new RegExp(`--color-primary-${s}:\\s*var\\(--color-accent-${s}\\)`),
      `missing primary-${s}`,
    );
  }
});

test("a tenant brand derives the whole primary set from --primary", () => {
  const i = css.indexOf(":root:is([data-brand-theme], [data-home-theme])");
  assert.ok(i >= 0, "tenant brand rule missing");
  const block = css.slice(i, css.indexOf("}", i));
  assert.match(block, /--color-accent-600:\s*var\(--primary\)/);
  assert.match(block, /--accent:\s*var\(--color-accent-600\)/);
  assert.match(block, /--primary-hover:\s*color-mix\(in srgb, var\(--primary\) 80%, white\)/);
});

test("categorical chart colors ship for both themes", () => {
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
    assert.match(css, new RegExp(`--color-chart-${n}:\\s*var\\(--chart-${n}\\)`));
  }
  assert.match(css, /--chart-1:\s*#3e6fd0/);
  const darkBlock = css.slice(css.indexOf("--chart-1: #5e88de") - 200);
  assert.match(darkBlock, /\[data-theme="dark"\]/);
});

test("the console canvas ships as bg-canvas for both themes", () => {
  assert.match(css, /--bg-canvas:\s*var\(--color-gray-100\)/);
  assert.match(
    css,
    /--bg-canvas:\s*color-mix\(in oklab, var\(--color-gray-900\) 75%, var\(--color-gray-950\)\)/,
  );
  assert.match(css, /--background-color-canvas:\s*var\(--bg-canvas\)/);
});
