import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sidebar } from "./Sidebar.js";

describe("Sidebar", () => {
  it("컨테이너로만 렌더한다 — nav 랜드마크는 NavList 소유", () => {
    const { container } = render(
      <Sidebar>
        <nav aria-label="주 메뉴" />
      </Sidebar>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
    expect(screen.getByRole("navigation", { name: "주 메뉴" })).toBeInTheDocument();
  });

  // 이 브랜치가 이미 두 번 만든 결함의 형태 — 클래스 문자열의 일부만 재면 색이
  // 드리프트해도 초록이다. `Sidebar.test.tsx` 는 폭·패딩·hidden/lg:flex·슬롯을 다
  // 재면서 `bg-*`/`border-*` 는 한 줄도 안 재고 있었고, 그래서 `bg-surface
  // border-default` 가 그대로 배포까지 갔다. 여기서는 루트 문자열을 통째로 고정한다.
  it("루트 클래스 문자열이 정본과 한 글자도 다르지 않다 — AppLayout.tsx:134", () => {
    const { container } = render(<Sidebar>x</Sidebar>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toBe(
      "bg-background border-border hidden h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r lg:flex lg:flex-col",
    );
    // 드리프트해 있던 값이 되돌아오지 않는지 이름으로도 못 박는다.
    expect(root.className).not.toContain("bg-surface");
    expect(root.className).not.toContain("border-default");
  });

  it("슬롯 래퍼 마크업도 고정한다 — 클래스만 재면 래퍼가 사라져도 초록이다", () => {
    const { container } = render(
      <Sidebar header={<div>브랜드</div>} footer={<div>계정</div>}>
        <div data-testid="body">본문</div>
      </Sidebar>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(3);
    expect((root.children[0] as HTMLElement).className).toBe("shrink-0");
    expect((root.children[1] as HTMLElement).className).toBe(
      "min-h-0 flex-1 overflow-y-auto px-[8px] py-[12px]",
    );
    expect((root.children[2] as HTMLElement).className).toBe("shrink-0");
    expect(screen.getByTestId("body").parentElement).toBe(root.children[1]);
  });

  it("정본 폭 토큰을 쓴다 — 하드코딩된 px 이 아니다", () => {
    const { container } = render(<Sidebar>x</Sidebar>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("w-[var(--sidebar-width)]");
    expect(root.className).not.toMatch(/w-\[\d+px\]/);
  });

  it("header 와 footer 슬롯을 각각 렌더한다", () => {
    render(
      <Sidebar header={<div>브랜드</div>} footer={<div>계정</div>}>
        <div>본문</div>
      </Sidebar>,
    );
    expect(screen.getByText("브랜드")).toBeInTheDocument();
    expect(screen.getByText("본문")).toBeInTheDocument();
    expect(screen.getByText("계정")).toBeInTheDocument();
  });

  it("본문만 스크롤한다 — 헤더/푸터는 고정", () => {
    render(
      <Sidebar header={<div>브랜드</div>} footer={<div>계정</div>}>
        <div data-testid="body">본문</div>
      </Sidebar>,
    );
    const scroller = screen.getByTestId("body").parentElement as HTMLElement;
    expect(scroller.className).toContain("overflow-y-auto");
  });

  it("본문 스크롤 영역 패딩은 AxHub 정본을 따른다(px-2/py-3) — InnerSidebar.tsx:347,357", () => {
    render(
      <Sidebar>
        <div data-testid="body">본문</div>
      </Sidebar>,
    );
    const scroller = screen.getByTestId("body").parentElement as HTMLElement;
    expect(scroller.className).toContain("px-[8px]");
    expect(scroller.className).toContain("py-[12px]");
    expect(scroller.className).not.toContain("px-[12px]");
    expect(scroller.className).not.toContain("py-[16px]");
  });

  it("lg 미만에서는 기본적으로 숨는다 — AxHub 는 모바일에서 별도 드로어를 쓴다 (AppLayout.tsx:134)", () => {
    const { container } = render(<Sidebar>x</Sidebar>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("hidden");
    expect(root.className).toContain("lg:flex");
  });

  it("className 으로 override 하면 항상 보이게 할 수 있다 — cn 이 hidden 을 이긴다", () => {
    const { container } = render(<Sidebar className="flex">x</Sidebar>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).not.toMatch(/(^|\s)hidden(?!\S)/);
    expect(root.className).toMatch(/(^|\s)flex(?!\S)/);
  });

  it("contentClassName 은 스크롤 영역에 붙는다 — AxHub 의 sidebar-scroll 을 전달하는 자리", () => {
    render(
      <Sidebar contentClassName="sidebar-scroll">
        <div data-testid="body">본문</div>
      </Sidebar>,
    );
    const scroller = screen.getByTestId("body").parentElement as HTMLElement;
    expect(scroller.className).toContain("sidebar-scroll");
  });
});
