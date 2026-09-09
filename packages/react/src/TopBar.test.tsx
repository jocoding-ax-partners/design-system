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

  it("정본 시맨틱 토큰을 쓴다 — 미정의 border-border/bg-background 가 아니다", () => {
    render(<TopBar />);
    const bar = screen.getByRole("banner");
    expect(bar.className).toContain("bg-content");
    expect(bar.className).toContain("border-default");
    expect(bar.className).not.toContain("border-border");
    expect(bar.className).not.toContain("bg-background");
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

  it("leading 은 좌측, actions 는 우측에 그린다", () => {
    render(<TopBar leading={<span>회차</span>} actions={<button>＋ 새 회차</button>} />);
    const leading = screen.getByText("회차").parentElement as HTMLElement;
    const actions = screen.getByRole("button", { name: "＋ 새 회차" }).parentElement as HTMLElement;
    expect(leading.className).toContain("min-w-0");
    expect(actions.className).toContain("ml-auto");
  });

  it("style 을 그대로 전달한다 — AxHub 의 관리 패널 폭 보정", () => {
    render(<TopBar style={{ marginRight: "var(--mgmt-panel-width, 0px)" }} />);
    expect(screen.getByRole("banner").style.marginRight).toBe("var(--mgmt-panel-width, 0px)");
  });
});
