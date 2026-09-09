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

  // 정본(axhub-frontend shared/PageHeader.tsx:41-56)의 마크업을 구조로 잰다.
  // 클래스 문자열만 재던 시절, 정본의 `<div class="flex flex-1 items-end gap-6">`
  // 래퍼가 통째로 빠져 있었는데 살아남은 문자열들은 전부 정확해서 아무 테스트도
  // 빨개지지 않았다. 태그·중첩·어느 요소가 무엇을 담는지를 같이 단언한다.
  it("정본 마크업 구조를 그대로 따른다 — shared/PageHeader.tsx:41-56", () => {
    const { container } = render(
      <PageHeader
        title="회차"
        description="진행 중인 기수"
        center={<span data-testid="center">중앙</span>}
        actions={<button>＋ 새 회차</button>}
      />,
    );

    const outer = container.firstElementChild as HTMLElement;
    expect(outer.tagName).toBe("DIV");
    expect(outer.className).toBe("flex shrink-0 items-end gap-5");
    // 바깥은 [래퍼, actions] 둘뿐이다 — actions 는 래퍼 **밖**이다(정본 :55).
    expect(outer.children).toHaveLength(2);

    const inner = outer.children[0] as HTMLElement;
    expect(inner.tagName).toBe("DIV");
    expect(inner.className).toBe("flex flex-1 items-end gap-6");

    const textColumn = inner.children[0] as HTMLElement;
    expect(textColumn.tagName).toBe("DIV");
    // 정본은 맨 `flex-1`. `min-w-0` 은 소비 앱이 실측 후 받아들인 유일한 이탈이고
    // changeset 의 이탈 목록에 적혀 있다(PageHeader.tsx JSDoc 참고).
    expect(textColumn.className).toBe("min-w-0 flex-1");
    expect(textColumn.contains(screen.getByRole("heading", { level: 1 }))).toBe(true);
    expect(textColumn.contains(screen.getByText("진행 중인 기수"))).toBe(true);

    // center 는 텍스트 컬럼의 형제로, 래퍼 **안**에 온다(정본 :52).
    expect(screen.getByTestId("center").parentElement).toBe(inner);
    expect(inner.children).toHaveLength(2);

    const actionsWrapper = outer.children[1] as HTMLElement;
    expect(actionsWrapper.className).toBe("flex items-center gap-3");
    expect(actionsWrapper.contains(screen.getByRole("button", { name: "＋ 새 회차" }))).toBe(true);
  });

  it("center 는 정본과 같은 노드 슬롯이다 — boolean 스위치가 아니다", () => {
    render(<PageHeader title="회차" center={<nav aria-label="탭" />} />);
    // boolean 이었다면 <nav> 는 아예 렌더되지 않고 클래스만 붙었다.
    expect(screen.getByRole("navigation", { name: "탭" })).toBeInTheDocument();
  });

  it("center 를 줘도 가운데 정렬 클래스를 붙이지 않는다 — 정본에 없는 동작이었다", () => {
    const { container } = render(<PageHeader title="회차" center={<span>중앙</span>} />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).not.toContain("justify-center");
    expect(outer.className).not.toContain("text-center");
  });

  it("center 를 안 주면 래퍼 안에 텍스트 컬럼만 남는다", () => {
    const { container } = render(<PageHeader title="회차" />);
    const inner = (container.firstElementChild as HTMLElement).children[0] as HTMLElement;
    expect(inner.className).toBe("flex flex-1 items-end gap-6");
    expect(inner.children).toHaveLength(1);
  });

  // 링 **색**. 근거는 NavItem.tsx 의 `itemClass` JSDoc — 색을 안 주면 Tailwind
  // 기본값이 `currentColor` 라 링이 그 자리 글자색(text-muted / hover:text-default)을
  // 따라간다. 번들의 다른 포커스 링은 전부 `var(--focus)` 다.
  it("뒤로 링크 포커스 링 색은 --focus 토큰이다", () => {
    render(<PageHeader title="2기" backTo="/rounds" />);
    const link = screen.getByRole("link", { name: "뒤로" });
    expect(link.className).toContain("focus-visible:ring-focus");
    expect(link.className).not.toMatch(/focus-visible:ring-\[/);
  });
});
