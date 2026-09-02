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
