import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeader } from "./PageHeader.js";

describe("PageHeader", () => {
  it("제목을 h1 으로 렌더한다 — 정본 타이포 32px/bold", () => {
    render(<PageHeader title="회차" />);
    const h1 = screen.getByRole("heading", { level: 1, name: "회차" });
    expect(h1.className).toContain("text-[32px]");
    expect(h1.className).toContain("font-bold");
  });

  it("설명을 제목 아래에 그린다", () => {
    render(<PageHeader title="회차" description="진행 중인 기수" />);
    const desc = screen.getByText("진행 중인 기수");
    expect(desc.className).toContain("text-muted");
    expect(desc.className).toContain("text-[18px]");
  });

  it("backTo 를 주면 뒤로 링크를 그린다", () => {
    render(<PageHeader title="2기" backTo="/rounds" />);
    expect(screen.getByRole("link", { name: "뒤로" })).toHaveAttribute("href", "/rounds");
  });

  it("뒤로 링크 아이콘은 AxHub 정본과 같은 ArrowLeft 다 — CaretLeft 가 아니다", () => {
    render(<PageHeader title="2기" backTo="/rounds" />);
    const link = screen.getByRole("link", { name: "뒤로" });
    const path = link.querySelector("svg path");
    // ArrowLeft(phosphor) 고유 path data. CaretLeft 로 되돌리면 이 값이 달라져 실패한다.
    expect(path).toHaveAttribute(
      "d",
      "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z",
    );
  });

  it("backLabel 로 링크 텍스트를 바꾼다", () => {
    render(<PageHeader title="2기" backTo="/rounds" backLabel="회차 목록" />);
    expect(screen.getByRole("link", { name: "회차 목록" })).toBeInTheDocument();
  });

  it("actions 를 렌더한다", () => {
    render(<PageHeader title="회차" actions={<button>＋ 새 회차</button>} />);
    expect(screen.getByRole("button", { name: "＋ 새 회차" })).toBeInTheDocument();
  });

  it("titleClassName 이 기본 클래스를 이긴다", () => {
    render(<PageHeader title="회차" titleClassName="text-[24px]" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("text-[24px]");
    expect(h1.className).not.toContain("text-[32px]");
  });

  it("renderLink 로 라우터 Link 를 주입한다", () => {
    render(
      <PageHeader
        title="2기"
        backTo="/rounds"
        renderLink={(p) => <a data-router="yes" {...p} />}
      />,
    );
    const link = screen.getByRole("link", { name: "뒤로" });
    expect(link).toHaveAttribute("data-router", "yes");
    expect(link).toHaveAttribute("href", "/rounds");
  });

  it("center 를 주면 가운데 정렬 클래스가 붙는다", () => {
    const { rerender } = render(<PageHeader title="회차" />);
    expect(screen.getByRole("heading", { level: 1 }).closest("div.flex")?.className).not.toContain(
      "justify-center",
    );

    rerender(<PageHeader title="회차" center />);
    const wrapper = screen.getByRole("heading", { level: 1 }).closest("div.flex");
    expect(wrapper?.className).toContain("justify-center");
    expect(wrapper?.className).toContain("text-center");
  });
});
