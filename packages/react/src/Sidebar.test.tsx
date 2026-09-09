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
});
