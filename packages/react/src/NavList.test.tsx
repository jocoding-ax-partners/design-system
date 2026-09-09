import { CaretRight } from "@phosphor-icons/react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NavList, type NavSection } from "./NavList.js";

const sections: NavSection[] = [
  {
    key: "main",
    items: [
      { key: "rounds", href: "/rounds", label: "회차", active: true },
      { key: "bank", href: "/bank", label: "문제은행" },
    ],
  },
  {
    key: "admin",
    label: "관리",
    items: [
      {
        key: "settings",
        href: "/settings",
        label: "환경설정",
        children: [{ key: "team", href: "/settings/team", label: "팀" }],
      },
    ],
  },
];

describe("NavList", () => {
  it("nav 랜드마크로 렌더하고 이름을 받는다", () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    expect(screen.getByRole("navigation", { name: "주 메뉴" })).toBeInTheDocument();
  });

  it("모든 항목을 링크로 렌더한다", () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    expect(screen.getByRole("link", { name: "회차" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "문제은행" })).toBeInTheDocument();
  });

  it("섹션 라벨이 있으면 그 섹션의 접근성 이름이 된다", () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    const group = screen.getByRole("group", { name: "관리" });
    expect(within(group).getByRole("button", { name: "환경설정" })).toBeInTheDocument();
  });

  it("섹션 라벨 클래스는 AxHub 정본을 그대로 따른다 — InnerSidebar.tsx:361", () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    const label = screen.getByText("관리");
    expect(label.className).toContain("text-muted");
    expect(label.className).toContain("px-3");
    expect(label.className).toContain("pt-4");
    expect(label.className).toContain("font-medium");
    expect(label.className).toContain("tracking-[-0.12px]");
    // 패키지가 한때 썼던 잘못된 값들이 남아있지 않아야 한다.
    expect(label.className).not.toContain("text-subtle");
    expect(label.className).not.toContain("mb-[6px]");
    expect(label.className).not.toContain("font-semibold");
  });

  it("항목·라벨 간격은 AxHub 처럼 균일한 gap-[8px] 하나다 — 2단 간격 모델이 아니다 (InnerSidebar.tsx:356-365)", () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    expect(nav.className).toContain("gap-[8px]");
    expect(nav.className).not.toContain("gap-[16px]");
    // 라벨이 있는 섹션의 group 래퍼는 자신의 레이아웃을 갖지 않는다 — contents 로
    // 상위 flex 컬럼에 라벨/항목을 그대로 흘려보내야 위 gap-[8px] 이 섹션 경계를
    // 넘나들며 균일하게 적용된다.
    const group = screen.getByRole("group", { name: "관리" });
    expect(group.className).toBe("contents");
  });

  it("자식이 있는 항목은 접힌 채 시작하고 단일 버튼이 aria-expanded 를 갖는다 (F4)", async () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    expect(screen.queryByRole("link", { name: "팀" })).not.toBeInTheDocument();

    // 버튼이 하나뿐이다 — 별도 토글 버튼이 없다.
    const settingsButtons = screen.getAllByRole("button", { name: /환경설정/ });
    expect(settingsButtons).toHaveLength(1);

    const trigger = settingsButtons[0];
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(screen.getByRole("link", { name: "팀" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("아코디언 트리거를 클릭하면 onSelect 도 함께 호출된다 — AxHub 는 첫 하위로 navigate 한다", async () => {
    const onSelect = vi.fn();
    render(
      <NavList
        aria-label="주 메뉴"
        sections={[
          {
            key: "s",
            items: [
              {
                key: "settings",
                label: "환경설정",
                onSelect,
                children: [{ key: "team", href: "/settings/team", label: "팀" }],
              },
            ],
          },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "환경설정" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("아코디언 캐럿은 CaretRight 다 — CaretDown 이 아니고, 열리면 90도 회전한다", async () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    const trigger = screen.getByRole("button", { name: "환경설정" });
    const svg = trigger.querySelector("svg");
    expect(svg).not.toBeNull();

    const { container: ref } = render(<CaretRight aria-hidden="true" weight="regular" />);
    const refPath = ref.querySelector("svg path")?.getAttribute("d");
    expect(svg?.querySelector("path")?.getAttribute("d")).toBe(refPath);
    expect(svg?.getAttribute("class")).toContain("opacity-40");
    expect(svg?.getAttribute("class")).not.toContain("rotate-90");

    await userEvent.click(trigger);
    expect(trigger.querySelector("svg")?.getAttribute("class")).toContain("rotate-90");
  });

  it("defaultOpen 이면 처음부터 펼쳐진다", () => {
    render(
      <NavList
        aria-label="주 메뉴"
        sections={[
          {
            key: "s",
            items: [
              {
                key: "settings",
                label: "환경설정",
                defaultOpen: true,
                children: [{ key: "team", href: "/settings/team", label: "팀" }],
              },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "팀" })).toBeInTheDocument();
  });

  it("activeColor 와 renderLink 를 모든 항목에 전달한다", () => {
    render(
      <NavList
        aria-label="주 메뉴"
        sections={sections}
        activeColor="rgb(9, 8, 7)"
        renderLink={(p) => <a data-router="yes" {...p} />}
      />,
    );
    const active = screen.getByRole("link", { name: "회차" });
    expect(active.style.color).toBe("rgb(9, 8, 7)");
    expect(active).toHaveAttribute("data-router", "yes");
    expect(screen.getByRole("link", { name: "문제은행" })).toHaveAttribute("data-router", "yes");
  });
});
