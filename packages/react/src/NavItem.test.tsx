import { Gear } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NavItem } from "./NavItem.js";

describe("NavItem", () => {
  it("href 를 주면 링크로 렌더한다 — div 가 아니다", () => {
    render(<NavItem href="/rounds" label="회차" />);
    const link = screen.getByRole("link", { name: "회차" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/rounds");
  });

  it("onSelect 만 주면 button 으로 렌더한다", () => {
    render(<NavItem onSelect={() => {}} label="테마" />);
    expect(screen.getByRole("button", { name: "테마" })).toHaveAttribute("type", "button");
  });

  it("활성이면 aria-current=page 를 단다", () => {
    render(<NavItem href="/rounds" label="회차" active />);
    expect(screen.getByRole("link", { name: "회차" })).toHaveAttribute("aria-current", "page");
  });

  it("비활성이면 aria-current 가 없다", () => {
    render(<NavItem href="/rounds" label="회차" />);
    expect(screen.getByRole("link", { name: "회차" })).not.toHaveAttribute("aria-current");
  });

  it("활성은 배경 없이 색만 바뀐다 — 정본(AxHub) 규칙", () => {
    render(<NavItem href="/r" label="회차" active activeColor="rgb(1, 2, 3)" />);
    const link = screen.getByRole("link", { name: "회차" });
    expect(link.style.color).toBe("rgb(1, 2, 3)");
    expect(link.className).toContain("font-semibold");
    expect(link.className).not.toMatch(/\bbg-/);
  });

  it("activeColor 를 안 주면 정본 primary 토큰을 쓴다", () => {
    render(<NavItem href="/r" label="회차" active />);
    expect(screen.getByRole("link", { name: "회차" }).style.color).toBe("var(--primary)");
  });

  it("아이콘은 장식이라 접근성 트리에서 숨는다", () => {
    const { container } = render(<NavItem href="/settings" icon={Gear} label="환경설정" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "환경설정" })).toBeInTheDocument();
  });

  it("아이콘 크기는 AxHub 정본(18px)을 따른다 — InnerSidebar.tsx:231,305", () => {
    const { container } = render(<NavItem href="/settings" icon={Gear} label="환경설정" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("h-[18px]");
    expect(svg?.getAttribute("class")).toContain("w-[18px]");
    // size={20} 이 심었던 고정 width/height 속성이 없어야 한다 — 있으면 SVG
    // 프레젠테이션 속성이 CSS 클래스보다 우선해 18px 클래스를 무력화할 수 있다.
    expect(svg).not.toHaveAttribute("width", "20");
    expect(svg).not.toHaveAttribute("height", "20");
  });

  // 아래 두 개는 패키지 자신의 동작이 아니라 **정본(axhub-frontend InnerSidebar)** 에
  // 대고 잰다. 한때 여기에 `min-w-0` 과 (링크에도) `text-left` 가 붙어 있었는데,
  // 정본 어디에도 없는 클래스였다.
  it("링크 라벨 span 은 정본과 한 글자도 다르지 않다 — InnerSidebar.tsx:310", () => {
    const { container } = render(<NavItem href="/r" label="회차" />);
    expect(container.querySelector("span")?.className).toBe("flex-1 truncate");
  });

  it("버튼 라벨 span 만 text-left 를 갖는다 — InnerSidebar.tsx:236", () => {
    const { container } = render(<NavItem onSelect={() => {}} label="테마" />);
    expect(container.querySelector("span")?.className).toBe("flex-1 truncate text-left");
  });

  it("포커스 링 클래스를 항상 단다", () => {
    render(<NavItem href="/r" label="회차" />);
    expect(screen.getByRole("link", { name: "회차" }).className).toContain("focus-visible:ring-2");
  });

  it("포커스 링 offset 색은 배경 토큰을 쓴다 — 안 그러면 다크모드에서 흰 헤일로가 생긴다", () => {
    render(<NavItem href="/r" label="회차" />);
    expect(screen.getByRole("link", { name: "회차" }).className).toContain(
      "focus-visible:ring-offset-background",
    );
  });

  it("renderLink 로 라우터 Link 를 주입할 수 있고 className/aria 가 전달된다", () => {
    render(
      <NavItem
        href="/rounds"
        label="회차"
        active
        renderLink={(p) => <a data-router="yes" {...p} />}
      />,
    );
    const link = screen.getByRole("link", { name: "회차" });
    expect(link).toHaveAttribute("data-router", "yes");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.className).toContain("rounded-[8px]");
  });

  it("dataAttrs 를 그대로 단다 — AxHub 튜토리얼 훅", () => {
    render(<NavItem href="/apps" label="앱" dataAttrs={{ "data-tutorial": "nav:/apps" }} />);
    expect(screen.getByRole("link", { name: "앱" })).toHaveAttribute("data-tutorial", "nav:/apps");
  });

  it("악의적 dataAttrs 는 aria-current/href 를 덮어쓸 수 없다 — 타입 narrowing 은 객체 리터럴만 막는다 (Task 10 재리뷰 Minor)", () => {
    // 변수로 타입된 Record<string, string> 은 `Record<`data-${string}`, …>` narrowing 을
    // 통과한다 — 여기서 방어하는 건 spread 순서(dataAttrs 가 구조적 prop 보다 먼저)다.
    const hostileAttrs: Record<string, string> = {
      "aria-current": "date",
      href: "/evil",
    };
    render(
      <NavItem
        href="/apps"
        label="앱"
        active
        dataAttrs={hostileAttrs as Record<`data-${string}`, string | undefined>}
      />,
    );
    const link = screen.getByRole("link", { name: "앱" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("href", "/apps");
  });

  it("악의적 dataAttrs 는 button 렌더에서도 aria-current 를 덮어쓸 수 없다", () => {
    const hostileAttrs: Record<string, string> = { "aria-current": "date" };
    render(
      <NavItem
        onSelect={() => {}}
        label="테마"
        active
        dataAttrs={hostileAttrs as Record<`data-${string}`, string | undefined>}
      />,
    );
    expect(screen.getByRole("button", { name: "테마" })).toHaveAttribute("aria-current", "page");
  });

  it("badge 를 라벨 뒤에 렌더한다", () => {
    render(<NavItem href="/q" label="심사" badge={<span>3</span>} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("onSelect 를 키보드로 실행할 수 있다", async () => {
    const onSelect = vi.fn();
    render(<NavItem onSelect={onSelect} label="테마" />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("href 도 onSelect 도 없으면 던진다", () => {
    expect(() => render(<NavItem label="아무것도" />)).toThrow(/href 또는 onSelect/);
  });
});
