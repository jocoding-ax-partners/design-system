import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const css = readFileSync(
  fileURLToPath(new URL("../theme/layout.css", import.meta.url)),
  "utf8",
);

describe("layout tokens", () => {
  it("정본이 사이드바 폭을 소유한다 — AxHub 값 244px", () => {
    expect(css).toMatch(/--sidebar-width:\s*244px/);
  });

  it("정본이 탑바 높이를 소유한다 — AxHub 값 60px", () => {
    expect(css).toMatch(/--topbar-height:\s*60px/);
  });

  it("두 값을 앱이 소유한다고 적힌 옛 주석이 남아 있지 않다", () => {
    expect(css).not.toMatch(/소비하는 앱/);
  });
});
