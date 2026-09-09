import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumbs } from "./Breadcrumbs.js";

describe("Breadcrumbs", () => {
  it("이름 있는 navigation 랜드마크로 렌더한다", () => {
    render(<Breadcrumbs items={[{ key: "r", label: "회차" }]} />);
    expect(screen.getByRole("navigation", { name: "위치" })).toBeInTheDocument();
  });

  it("마지막 항목이 현재 위치다 — aria-current=page, 링크 아님", () => {
    render(
      <Breadcrumbs
        items={[
          { key: "r", label: "회차", href: "/rounds" },
          { key: "d", label: "2기" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "회차" })).toHaveAttribute("href", "/rounds");
    const current = screen.getByText("2기");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).not.toBe("A");
  });

  it("구분자는 장식이라 접근성 트리에서 숨는다", () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { key: "r", label: "회차", href: "/rounds" },
          { key: "d", label: "2기" },
        ]}
      />,
    );
    const seps = container.querySelectorAll('[aria-hidden="true"]');
    expect(seps).toHaveLength(1);
    expect(seps[0].textContent).toBe("/");
  });

  it("항목이 하나면 구분자가 없다", () => {
    const { container } = render(<Breadcrumbs items={[{ key: "r", label: "회차" }]} />);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  it("renderLink 로 라우터 Link 를 주입한다", () => {
    render(
      <Breadcrumbs
        items={[
          { key: "r", label: "회차", href: "/rounds" },
          { key: "d", label: "2기" },
        ]}
        renderLink={(p) => <a data-router="yes" {...p} />}
      />,
    );
    expect(screen.getByRole("link", { name: "회차" })).toHaveAttribute("data-router", "yes");
  });

  it("마지막 항목은 href 가 있어도 링크가 아니다", () => {
    render(
      <Breadcrumbs
        items={[
          { key: "r", label: "회차", href: "/rounds" },
          { key: "d", label: "1회차", href: "/rounds/1" },
        ]}
      />,
    );

    expect(screen.queryByRole("link", { name: "1회차" })).toBeNull();
    expect(screen.getByText("1회차")).toHaveAttribute("aria-current", "page");
  });

  it("포커스 링 offset 색은 배경 토큰을 쓴다 — 안 그러면 다크모드에서 흰 헤일로가 생긴다", () => {
    render(
      <Breadcrumbs
        items={[
          { key: "r", label: "회차", href: "/rounds" },
          { key: "d", label: "2기" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "회차" }).className).toContain(
      "focus-visible:ring-offset-background",
    );
  });

  // 링 **색**. 근거는 NavItem.tsx 의 `itemClass` JSDoc — 색을 안 주면 Tailwind
  // 기본값이 `currentColor` 라 링이 그 자리 글자색을 따라간다. 번들의 다른 포커스
  // 링은 전부 `var(--focus)` 다. 링크 클래스 문자열도 통째로 고정한다.
  it("링크 클래스 문자열을 통째로 고정한다 — 포커스 링 색은 --focus 토큰이다", () => {
    render(
      <Breadcrumbs
        items={[
          { key: "r", label: "회차", href: "/rounds" },
          { key: "d", label: "2기" },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "회차" });
    expect(link.className).toBe(
      "text-muted hover:text-default min-w-0 shrink-0 truncate transition-colors focus-visible:ring-focus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
    );
    expect(link.className).not.toMatch(/focus-visible:ring-\[/);
  });
});
