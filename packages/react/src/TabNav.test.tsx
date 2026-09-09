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

  it("포커스 링 offset 색은 배경 토큰을 쓴다 — 안 그러면 다크모드에서 흰 헤일로가 생긴다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    expect(screen.getByRole("tab", { name: "개요" }).className).toContain(
      "focus-visible:ring-offset-background",
    );
  });

  // 링 **색**. 색을 안 주면 Tailwind 기본값 `currentColor` 라 링이 활성 탭
  // (text-default)과 비활성 탭(text-default/90)에서 갈린다. 근거는 NavItem.tsx 의
  // `itemClass` JSDoc — 번들의 다른 포커스 링은 전부 `var(--focus)` 다.
  it("포커스 링 색은 --focus 토큰이다 — currentColor 면 탭마다 색이 달라진다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    const link = screen.getByRole("tab", { name: "개요" });
    expect(link.className).toContain("focus-visible:ring-focus");
    expect(link.className).not.toMatch(/focus-visible:ring-\[/);
  });

  // 43de815 회귀 가드. 그 커밋은 탭 링크를 감싸던 <span> 을 없앴다 — span 이 flex
  // 아이템이 되면 `shrink-0` 은 안쪽 <a> 에 있어 효력을 잃고, 좁은 화면에서 탭이
  // 가로 스크롤 대신 찌그러진다(2026-09-09 실측, 320px·탭 7개: 탭 폭 전부 44.1px,
  // 탭바 높이 54→117px). 그런데 기존 테스트 10개 중 어느 것도 span 이 돌아와도
  // 빨개지지 않았다 — `getByRole("tab")` 은 여전히 안쪽 <a> 를 집고, href·aria-*·
  // style·data-router 도 전부 그 <a> 에 그대로 있기 때문이다. 마크업을 직접 잰다.
  it("탭 링크는 tablist 의 직접 자식 <a> 다 — span 으로 감싸면 shrink-0 이 무력화된다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.children).toHaveLength(tabs.length);
    for (const child of Array.from(tablist.children)) {
      expect(child.tagName).toBe("A");
    }
    expect(screen.getByRole("tab", { name: "개요" }).parentElement).toBe(tablist);
    expect(screen.getByRole("tab", { name: /로그/ }).parentElement).toBe(tablist);
  });

  it("renderLink 가 span 을 덧씌워도 링크가 tablist 의 직접 자식으로 남는다", () => {
    render(
      <TabNav
        tabs={tabs}
        activeKey="overview"
        renderLink={(p) => <a data-router="yes" {...p} />}
      />,
    );
    const tablist = screen.getByRole("tablist");
    expect(Array.from(tablist.children).every((c) => c.tagName === "A")).toBe(true);
  });

  it("비활성 탭 클래스 문자열을 통째로 고정한다 — 정본 TabNav.tsx:29-49 + 선언된 a11y 줄", () => {
    render(<TabNav tabs={tabs} activeKey="logs" />);
    expect(screen.getByRole("tab", { name: "개요" }).className).toBe(
      "flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2 text-sm leading-[1.5] transition-colors sm:px-4 focus-visible:ring-focus focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none text-default/90 hover:text-default border-transparent font-normal",
    );
  });

  it("활성 탭 클래스 문자열을 통째로 고정한다", () => {
    render(<TabNav tabs={tabs} activeKey="overview" />);
    expect(screen.getByRole("tab", { name: "개요" }).className).toBe(
      "flex shrink-0 items-center gap-1.5 border-b-2 border-transparent px-2.5 py-2 text-sm leading-[1.5] transition-colors sm:px-4 focus-visible:ring-focus focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none text-default font-semibold",
    );
  });

  it("바깥 래퍼는 정본의 밑줄 경계선만 갖는다 — TabNav.tsx:29", () => {
    const { container } = render(<TabNav tabs={tabs} activeKey="overview" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
    expect(root.className).toBe("border-divider border-b");
    expect((root.children[0] as HTMLElement).tagName).toBe("NAV");
    expect((root.children[0] as HTMLElement).className).toBe(
      "-mb-px flex w-full max-w-full min-w-0 items-start gap-1 overflow-x-auto px-2",
    );
  });
});
