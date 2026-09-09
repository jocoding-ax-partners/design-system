import { ArrowLeft } from "@phosphor-icons/react";
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

    // 하드코딩 path 리터럴 대신 실제 ArrowLeft 를 참조로 렌더해 비교한다 — 이렇게
    // 해야 @phosphor-icons/react 의 정당한 업스트림 리드로우(semver 호환 패치)에는
    // 흔들리지 않고, CaretLeft 로 되돌리는 회귀만 잡는다.
    const { container: ref } = render(<ArrowLeft aria-hidden="true" />);
    const refPath = ref.querySelector("svg path")?.getAttribute("d");
    expect(refPath).toBeTruthy();
    expect(path).toHaveAttribute("d", refPath);
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

  it("뒤로 링크 포커스 링 offset 색은 배경 토큰을 쓴다 — 안 그러면 다크모드에서 흰 헤일로가 생긴다", () => {
    render(<PageHeader title="2기" backTo="/rounds" />);
    expect(screen.getByRole("link", { name: "뒤로" }).className).toContain(
      "focus-visible:ring-offset-background",
    );
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
