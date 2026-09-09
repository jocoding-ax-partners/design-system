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

  // `itemClass` 는 이 여덟 개 중 유일하게 AxHub 프로덕션에서 살아 도는 클래스인데,
  // 지금까지 `toContain("rounded-[8px]")` 같은 조각만 재고 있었다 — `h-[32px]`·
  // `gap-[8px]`·`px-[12px]`·`text-[14px]`·`border border-transparent` 중 무엇이
  // 바뀌어도 초록이었다. 문자열을 통째로 고정한다. 앞부분은 정본
  // (axhub-frontend InnerSidebar.tsx:128-133) 이고, `focus-visible:*` 줄은 정본에
  // 없는 **선언된** 접근성 확장이다(NavItem.tsx `itemClass` JSDoc 참고).
  it("비활성 링크 클래스 문자열을 통째로 고정한다 — InnerSidebar.tsx:128-133", () => {
    render(<NavItem href="/r" label="회차" />);
    const link = screen.getByRole("link", { name: "회차" });
    expect(link.className).toBe(
      "flex h-[32px] w-full items-center gap-[8px] rounded-[8px] border border-transparent px-[12px] text-[14px] transition-colors focus-visible:ring-focus focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none text-default hover:bg-[var(--opacity-gray-50)] dark:hover:bg-[var(--opacity-white-50)]",
    );
  });

  it("활성 링크 클래스 문자열을 통째로 고정한다 — 배경 없이 font-semibold 만", () => {
    render(<NavItem href="/r" label="회차" active />);
    const link = screen.getByRole("link", { name: "회차" });
    expect(link.className).toBe(
      "flex h-[32px] w-full items-center gap-[8px] rounded-[8px] border border-transparent px-[12px] text-[14px] transition-colors focus-visible:ring-focus focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none font-semibold",
    );
  });

  // 아이콘 색은 이 브랜치가 새로 승격한 토큰(`--icon-inactive`)의 패키지 내 유일한
  // 소비처다. 크기와 aria-hidden 은 재면서 색은 아무도 안 재고 있었다.
  it("비활성 아이콘은 정본의 --icon-inactive 를 쓴다 — InnerSidebar.tsx:305-308", () => {
    const { container } = render(<NavItem href="/settings" icon={Gear} label="환경설정" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.color).toBe("var(--icon-inactive)");
  });

  it("활성 아이콘은 그 override 를 떼고 행의 색을 물려받는다 — InnerSidebar.tsx:306", () => {
    const { container } = render(<NavItem href="/settings" icon={Gear} label="환경설정" active />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.color).toBe("");
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

  // 링 **색**. 안 주면 Tailwind 기본값이 `currentColor` 라 링이 그 자리 글자색을
  // 따라가고, 활성(primary)과 비활성(text-default)에서 색이 갈린다. 번들에 실려
  // 나가는 다른 포커스 링은 전부 `var(--focus)` 다(@heroui/styles dist 실측
  // 2026-09-09: `--tw-ring-color:var(--focus)` 47건 + `outline-color:var(--focus)`
  // 2건, `currentColor` 0건).
  it("포커스 링 색은 --focus 토큰이다 — currentColor 면 항목마다 색이 달라진다", () => {
    render(<NavItem href="/r" label="회차" />);
    const link = screen.getByRole("link", { name: "회차" });
    expect(link.className).toContain("focus-visible:ring-focus");
    expect(link.className).not.toMatch(/focus-visible:ring-\[/);
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
