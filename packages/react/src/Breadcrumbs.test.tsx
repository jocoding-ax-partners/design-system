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
});
