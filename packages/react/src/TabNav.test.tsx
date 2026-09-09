import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TabNav, type TabNavTab } from "./TabNav.js";

const tabs: TabNavTab[] = [
  { key: "overview", to: "/apps", label: "개요" },
  { key: "logs", to: "/apps/logs", label: "로그", badge: <span>3</span> },
];

describe("TabNav", () => {
  it("tablist 로 렌더하고 가로 방향임을 알린다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("모든 탭을 role=tab 링크로 렌더한다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    expect(screen.getByRole("tab", { name: "개요" })).toHaveAttribute("href", "/apps");
    expect(screen.getByRole("tab", { name: /로그/ })).toHaveAttribute("href", "/apps/logs");
  });

  it("활성 탭은 aria-current=page 와 굵은 글씨, 밑줄 색을 갖는다", () => {
    render(<TabNav tabs={tabs} activeKey="logs" activeColor="rgb(4, 5, 6)" />);
    const active = screen.getByRole("tab", { name: /로그/ });
    expect(active).toHaveAttribute("aria-current", "page");
    expect(active).toHaveAttribute("aria-selected", "true");
    expect(active.className).toContain("font-semibold");
    expect(active.style.borderColor).toBe("rgb(4, 5, 6)");
  });

  it("비활성 탭은 밑줄 색이 없고 aria-selected=false 다", () => {
    render(<TabNav tabs={tabs} activeKey="logs" activeColor="rgb(4, 5, 6)" />);
    const inactive = screen.getByRole("tab", { name: "개요" });
    expect(inactive.style.borderColor).toBe("");
    expect(inactive).toHaveAttribute("aria-selected", "false");
  });

  it("비활성 탭 텍스트는 AxHub 정본 대비를 쓴다 — text-muted 가 아니다", () => {
    render(<TabNav tabs={tabs} activeKey="logs" />);
    const inactive = screen.getByRole("tab", { name: "개요" });
    expect(inactive.className).toContain("text-default/90");
    expect(inactive.className).not.toContain("text-muted");
  });

  it("가로로 넘치면 목록 안에서 스크롤한다 — 페이지가 밀리지 않는다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    expect(screen.getByRole("tablist").className).toContain("overflow-x-auto");
  });

  it("badge 를 HeroUI Chip 으로 렌더한다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    const badge = screen.getByText("3");
    expect(badge.closest('[data-slot="chip"]')).not.toBeNull();
  });

  it("renderLink 로 라우터 Link 를 주입한다", () => {
    render(
      <TabNav
        tabs={tabs}
        activeKey="overview"
        renderLink={(p) => <a data-router="yes" {...p} />}
      />,
    );
    const link = screen.getByRole("tab", { name: "개요" });
    expect(link).toHaveAttribute("data-router", "yes");
    expect(link).toHaveAttribute("href", "/apps");
  });

  it("activeColor 를 안 주면 var(--primary) 로 밑줄 색을 정한다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    expect(screen.getByRole("tab", { name: "개요" }).style.borderColor).toBe("var(--primary)");
  });
});
