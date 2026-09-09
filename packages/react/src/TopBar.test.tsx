import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TopBar } from "./TopBar.js";

describe("TopBar", () => {
  it("banner 랜드마크(header)로 렌더한다", () => {
    render(<TopBar leading={<span>제목</span>} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("정본 높이 토큰을 쓴다 — 하드코딩 60px 이 아니다", () => {
    render(<TopBar />);
    const bar = screen.getByRole("banner");
    expect(bar.className).toContain("h-[var(--topbar-height)]");
    expect(bar.className).not.toMatch(/h-\[\d+px\]/);
  });

  it("정본 클래스 문자열을 쓴다 — bg-background/border-border", () => {
    render(<TopBar />);
    const bar = screen.getByRole("banner");
    expect(bar.className).toContain("bg-background");
    expect(bar.className).toContain("border-border");
  });

  it("border-b 는 lg 이상에서만 붙는다 — 모바일엔 사이드바가 없어 뜬 줄이 된다 (Topbar.tsx:16-18)", () => {
    render(<TopBar />);
    const bar = screen.getByRole("banner");
    expect(bar.className).toContain("lg:border-b");
    expect(bar.className).not.toMatch(/(^|\s)border-b(?!\S)/);
  });

  it("rail 을 주면 사이드바 폭짜리 영역에 그린다", () => {
    render(<TopBar rail={<span>워크스페이스</span>} />);
    const rail = screen.getByText("워크스페이스").parentElement as HTMLElement;
    expect(rail.className).toContain("w-[var(--sidebar-width)]");
  });

  it("rail 을 안 주면 그 영역 자체가 없다", () => {
    const { container } = render(<TopBar leading={<span>회차</span>} />);
    expect(container.querySelector('[class*="--sidebar-width"]')).toBeNull();
  });

  it("leading 은 좌측, actions 는 우측에 그린다 — 양끝 정렬은 행의 justify-between 이 한다", () => {
    render(<TopBar leading={<span>회차</span>} actions={<button>＋ 새 회차</button>} />);
    const leading = screen.getByText("회차").parentElement as HTMLElement;
    const actions = screen.getByRole("button", { name: "＋ 새 회차" }).parentElement as HTMLElement;
    const row = leading.parentElement as HTMLElement;
    expect(row.className).toContain("justify-between");
    expect(leading.className).toContain("flex items-center gap-2 lg:gap-4");
    expect(actions.className).toContain("flex items-center gap-3");
  });

  // 좁은 화면 회귀 가드. leading 에 min-w-0 이 붙으면 그 래퍼가 0까지 줄고, 안쪽
  // 햄버거는 shrink-0 이라 래퍼 밖으로 삐져나와 유틸리티 묶음 밑에 깔린다(묶음이
  // DOM 상 뒤라 클릭도 가져간다). 2026-09-09 실측: 유틸리티 290.4px 기준 320px 에서
  // 36px 버튼 중 16px, 360px 에서 2.38px 이 덮였다. 정본은 같은 압력을 겹침이 아니라
  // 오른쪽 오버플로로 흘린다.
  it("안쪽 행이 정본 클래스와 한 글자도 다르지 않다 — min-w-0/ml-auto/gap-4 는 좁은 화면 겹침을 만든다", () => {
    render(<TopBar leading={<span>회차</span>} actions={<button>＋ 새 회차</button>} />);
    const leading = screen.getByText("회차").parentElement as HTMLElement;
    const actions = screen.getByRole("button", { name: "＋ 새 회차" }).parentElement as HTMLElement;
    const row = leading.parentElement as HTMLElement;

    expect(row.className).toBe("flex min-w-0 flex-1 items-center justify-between px-5");
    expect(leading.className).toBe("flex items-center gap-2 lg:gap-4");
    expect(actions.className).toBe("flex items-center gap-3");
  });

  it("actions 를 안 줘도 우측 래퍼는 남는다 — 정본이 항상 그렸다", () => {
    render(<TopBar leading={<span>회차</span>} />);
    const leading = screen.getByText("회차").parentElement as HTMLElement;
    const row = leading.parentElement as HTMLElement;
    expect(row.children).toHaveLength(2);
    expect((row.children[1] as HTMLElement).className).toBe("flex items-center gap-3");
  });

  it("style 을 그대로 전달한다 — AxHub 의 관리 패널 폭 보정", () => {
    render(<TopBar style={{ marginRight: "var(--mgmt-panel-width, 0px)" }} />);
    expect(screen.getByRole("banner").style.marginRight).toBe("var(--mgmt-panel-width, 0px)");
  });
});
