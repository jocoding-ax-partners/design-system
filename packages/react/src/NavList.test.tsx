import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

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
    expect(within(group).getByRole("link", { name: "환경설정" })).toBeInTheDocument();
  });

  it("자식이 있는 항목은 접힌 채 시작하고 토글 버튼을 갖는다", async () => {
    render(<NavList sections={sections} aria-label="주 메뉴" />);
    expect(screen.queryByRole("link", { name: "팀" })).not.toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: "환경설정 하위 메뉴 열기" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(screen.getByRole("link", { name: "팀" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "환경설정 하위 메뉴 닫기" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
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
                href: "/settings",
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
