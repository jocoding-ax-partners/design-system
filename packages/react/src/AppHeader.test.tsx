import type { NavLinkRenderProps } from "./NavItem.js";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AppHeader, type AppHeaderProps } from "./AppHeader.js";

const SETTINGS = {
  label: "계정 설정",
  href: "https://acme.axhub.ai/settings/profile",
  external: true,
};
const ADMIN = { label: "관리자 페이지", href: "/manage" };

function setup(overrides: Partial<AppHeaderProps> = {}) {
  const onLogout = vi.fn();
  const utils = render(
    <AppHeader
      logo={<span>APTA</span>}
      nav={[
        { label: "응시 현황", href: "/", active: true },
        { label: "도움말", href: "/help" },
      ]}
      user={{ name: "김하늘", email: "sky@acme.com" }}
      accountItems={[SETTINGS]}
      onLogout={onLogout}
      {...overrides}
    />,
  );
  return { ...utils, onLogout, user: userEvent.setup() };
}

const menuButton = () => screen.getByRole("button", { name: /계정 메뉴/ });

describe("AppHeader", () => {
  it("TopBar 를 감싼 banner 랜드마크이고 높이는 앱 CSS 변수 --gnb-h 를 먼저 읽는다", () => {
    setup();
    const bar = screen.getByRole("banner");
    expect(bar.className).toContain("h-[var(--gnb-h,var(--topbar-height))]");
    // TopBar 기본 높이 클래스는 twMerge 로 대체돼 하나만 남는다 — 새 토큰을 만들지 않는다.
    expect(bar.className).not.toContain("h-[var(--topbar-height)]");
    expect(bar.className).not.toMatch(/h-\[\d+px\]/);
  });

  it("로고는 leading 에 그린다 — rail 은 lg 미만에서 숨으므로 쓰지 않는다", () => {
    const { container } = setup();
    expect(screen.getByText("APTA")).toBeInTheDocument();
    expect(container.querySelector('[class*="--sidebar-width"]')).toBeNull();
  });

  it("상단 메뉴를 내비게이션 랜드마크로 그리고 현재 칸에 aria-current 를 단다", () => {
    setup();
    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    expect(within(nav).getByRole("link", { name: "응시 현황" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "도움말" })).not.toHaveAttribute("aria-current");
  });

  it("nav 가 비면 내비게이션 랜드마크를 그리지 않는다", () => {
    setup({ nav: [] });
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("trailing 슬롯을 계정 버튼 앞에 그린다 (알림 종·테마 토글 자리)", () => {
    setup({ trailing: <button type="button">알림</button> });
    const bell = screen.getByRole("button", { name: "알림" });
    expect(
      bell.compareDocumentPosition(menuButton()) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  describe("계정 메뉴 버튼", () => {
    it("접근 가능한 이름에 사용자 이름이 들어가고 메뉴를 연다는 것을 알린다", () => {
      setup();
      const btn = menuButton();
      expect(btn).toHaveAccessibleName("계정 메뉴 · 김하늘");
      expect(btn).toHaveAttribute("aria-haspopup", "menu");
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });

    it("이름이 없으면 이메일로 이름을 짓는다", () => {
      setup({ user: { name: "", email: "sky@acme.com" } });
      expect(menuButton()).toHaveAccessibleName("계정 메뉴 · sky@acme.com");
    });

    it("avatarUrl 이 있으면 장식 이미지로, 없으면 첫 글자로 그린다", () => {
      const { unmount } = setup();
      expect(menuButton()).toHaveTextContent("김");
      unmount();
      const { container } = setup({
        user: { name: "김하늘", email: "sky@acme.com", avatarUrl: "/a.png" },
      });
      const img = container.querySelector("img");
      expect(img).toHaveAttribute("src", "/a.png");
      expect(img).toHaveAttribute("alt", "");
    });
  });

  describe("계정 메뉴 내용", () => {
    it("클릭하면 열리고 이름·이메일·항목·로그아웃을 그린다", async () => {
      const { user } = setup();
      await user.click(menuButton());
      expect(menuButton()).toHaveAttribute("aria-expanded", "true");
      const menu = screen.getByRole("menu");
      expect(menuButton()).toHaveAttribute("aria-controls", menu.id);
      expect(within(menu).getByText("sky@acme.com")).toBeInTheDocument();
      const items = within(menu).getAllByRole("menuitem");
      expect(items.map((el) => el.textContent)).toEqual([
        expect.stringContaining("계정 설정"),
        "로그아웃",
      ]);
    });

    it("external 항목은 새 창(target=_blank, rel=noreferrer)으로 연다", async () => {
      const { user } = setup();
      await user.click(menuButton());
      const settings = screen.getByRole("menuitem", { name: /계정 설정/ });
      expect(settings).toHaveAttribute("href", SETTINGS.href);
      expect(settings).toHaveAttribute("target", "_blank");
      expect(settings).toHaveAttribute("rel", "noreferrer");
      expect(settings).toHaveAccessibleName(/새 창/);
    });

    it("표면 전환 항목 0개 — 계정 설정과 로그아웃만 있다 (권한 판정은 앱 몫)", async () => {
      const { user } = setup({ accountItems: [SETTINGS] });
      await user.click(menuButton());
      expect(screen.getAllByRole("menuitem")).toHaveLength(2);
      expect(screen.queryByRole("menuitem", { name: "관리자 페이지" })).toBeNull();
    });

    it("표면 전환 항목 1개 — 받은 그대로 하나 더 그리고 새 창이 아니다", async () => {
      const { user } = setup({ accountItems: [SETTINGS, ADMIN] });
      await user.click(menuButton());
      expect(screen.getAllByRole("menuitem")).toHaveLength(3);
      const admin = screen.getByRole("menuitem", { name: "관리자 페이지" });
      expect(admin).toHaveAttribute("href", "/manage");
      expect(admin).not.toHaveAttribute("target");
    });

    it("항목이 하나도 없어도 로그아웃은 늘 있다", async () => {
      const { user } = setup({ accountItems: [] });
      await user.click(menuButton());
      expect(screen.getAllByRole("menuitem")).toHaveLength(1);
      expect(screen.getByRole("menuitem", { name: "로그아웃" })).toBeInTheDocument();
    });

    it("로그아웃을 누르면 onLogout 을 부른다", async () => {
      const { user, onLogout } = setup();
      await user.click(menuButton());
      await user.click(screen.getByRole("menuitem", { name: "로그아웃" }));
      expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it("onLogout 이 실패(reject)하면 메뉴를 닫지 않고 안에 한 줄을 남긴다", async () => {
      const { user } = setup({ onLogout: () => Promise.reject(new Error("x")) });
      await user.click(menuButton());
      await user.click(screen.getByRole("menuitem", { name: "로그아웃" }));
      expect(await within(screen.getByRole("menu")).findByRole("alert")).toHaveTextContent(
        "지금은 로그아웃할 수 없어요",
      );
    });

    it("onLogout 이 진행 중이면 로그아웃 항목을 막고 진행 문구를 보인다", async () => {
      let resolve!: () => void;
      const pending = new Promise<void>((r) => {
        resolve = r;
      });
      const { user } = setup({ onLogout: () => pending });
      await user.click(menuButton());
      await user.click(screen.getByRole("menuitem", { name: "로그아웃" }));
      const busy = screen.getByRole("menuitem", { name: "로그아웃 중…" });
      expect(busy).toBeDisabled();
      await act(async () => {
        resolve();
        await pending;
      });
    });

    it("항목을 누르면 메뉴가 닫힌다", async () => {
      const { user } = setup({ accountItems: [SETTINGS, ADMIN] });
      await user.click(menuButton());
      await user.click(screen.getByRole("menuitem", { name: "관리자 페이지" }));
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("바깥을 누르면 닫힌다", async () => {
      const { user } = setup();
      await user.click(menuButton());
      await user.click(screen.getByText("APTA"));
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  describe("넓은 화면 팝오버 · 좁은 화면 바텀시트", () => {
    it("md 미만은 화면 아래 붙은 시트, md 이상은 버튼 아래 팝오버다", async () => {
      const { user } = setup();
      await user.click(menuButton());
      const menu = screen.getByRole("menu");
      for (const c of ["fixed", "inset-x-0", "bottom-0", "rounded-t-[20px]"]) {
        expect(menu.className).toContain(c);
      }
      for (const c of ["md:absolute", "md:top-11", "md:right-0", "md:w-[240px]", "md:rounded-xl"]) {
        expect(menu.className).toContain(c);
      }
    });

    it("좁은 화면 시트 뒤에 md 이상에서 숨는 막을 깔고, 막을 누르면 닫힌다", async () => {
      const { user, container } = setup();
      await user.click(menuButton());
      const scrim = container.querySelector("[data-account-menu-scrim]") as HTMLElement;
      expect(scrim).not.toBeNull();
      expect(scrim.className).toContain("md:hidden");
      expect(scrim).toHaveAttribute("aria-hidden", "true");
      await user.click(scrim);
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  describe("키보드 (NFR-003)", () => {
    it("Enter 로 열면 첫 항목에 포커스가 간다", async () => {
      const { user } = setup();
      menuButton().focus();
      await user.keyboard("{Enter}");
      expect(screen.getByRole("menuitem", { name: /계정 설정/ })).toHaveFocus();
    });

    it("Space 로도 연다", async () => {
      const { user } = setup();
      menuButton().focus();
      await user.keyboard(" ");
      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /계정 설정/ })).toHaveFocus();
    });

    it("ArrowDown 으로 열면 첫 항목, ArrowUp 으로 열면 마지막 항목", async () => {
      const { user } = setup();
      menuButton().focus();
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("menuitem", { name: /계정 설정/ })).toHaveFocus();
      await user.keyboard("{Escape}");
      await user.keyboard("{ArrowUp}");
      expect(screen.getByRole("menuitem", { name: "로그아웃" })).toHaveFocus();
    });

    it("ArrowDown/ArrowUp 은 항목 사이를 돌고 Home/End 는 양끝으로 간다", async () => {
      const { user } = setup({ accountItems: [SETTINGS, ADMIN] });
      menuButton().focus();
      await user.keyboard("{Enter}");
      const settings = screen.getByRole("menuitem", { name: /계정 설정/ });
      const admin = screen.getByRole("menuitem", { name: "관리자 페이지" });
      const logout = screen.getByRole("menuitem", { name: "로그아웃" });
      await user.keyboard("{ArrowDown}");
      expect(admin).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(logout).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(settings).toHaveFocus();
      await user.keyboard("{ArrowUp}");
      expect(logout).toHaveFocus();
      await user.keyboard("{Home}");
      expect(settings).toHaveFocus();
      await user.keyboard("{End}");
      expect(logout).toHaveFocus();
    });

    it("항목은 roving tabindex 다 — 메뉴 안 항목은 Tab 순서에 끼지 않는다", async () => {
      const { user } = setup({ accountItems: [SETTINGS, ADMIN] });
      await user.click(menuButton());
      for (const item of screen.getAllByRole("menuitem")) {
        expect(item).toHaveAttribute("tabindex", "-1");
      }
    });

    it("Escape 로 닫고 포커스를 메뉴 버튼으로 돌려준다", async () => {
      const { user } = setup();
      menuButton().focus();
      await user.keyboard("{Enter}");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("menu")).toBeNull();
      expect(menuButton()).toHaveFocus();
      expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    });

    it("Tab 으로 메뉴를 벗어나면 닫힌다", async () => {
      const { user } = setup();
      menuButton().focus();
      await user.keyboard("{Enter}");
      await user.tab();
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("항목에서 Enter 를 누르면 그 항목이 실행된다 (로그아웃)", async () => {
      const { user, onLogout } = setup();
      menuButton().focus();
      await user.keyboard("{ArrowUp}");
      await user.keyboard("{Enter}");
      expect(onLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("renderLink 위임", () => {
    it("상단 메뉴와 계정 메뉴 링크를 모두 앱이 넘긴 렌더러로 그린다", async () => {
      const calls: NavLinkRenderProps[] = [];
      const renderLink = (props: NavLinkRenderProps) => {
        calls.push(props);
        return <a data-router-link="" {...props} />;
      };
      const { user } = setup({ renderLink, accountItems: [SETTINGS, ADMIN] });
      expect(screen.getByRole("link", { name: "도움말" })).toHaveAttribute("data-router-link");
      await user.click(menuButton());
      const admin = screen.getByRole("menuitem", { name: "관리자 페이지" });
      expect(admin).toHaveAttribute("data-router-link");
      const settingsCall = calls.find((c) => c.href === SETTINGS.href);
      expect(settingsCall).toMatchObject({
        role: "menuitem",
        target: "_blank",
        rel: "noreferrer",
      });
    });

    it("렌더러 없이도 평범한 <a> 로 그린다", () => {
      setup();
      expect(screen.getByRole("link", { name: "도움말" }).tagName).toBe("A");
    });
  });

  // ── 2.2.0 추가 prop — AxLMS(U-A3) 가 자기 GNB 를 이 컴포넌트로 바꾸려면 필요한 자리.
  //    전부 선택 prop 이고, 안 넘기면 위의 기존 동작·모양 그대로다.
  describe("accountButtonProps · accountMenuProps (data-*·aria-* 전달)", () => {
    it("계정 버튼과 계정 메뉴에 data-*·aria-* 를 그대로 싣는다", async () => {
      const { user } = setup({
        accountButtonProps: { "data-admin-guide": "account", "aria-describedby": "hint" },
        accountMenuProps: { "data-admin-guide": "account-menu" },
      });
      expect(menuButton()).toHaveAttribute("data-admin-guide", "account");
      expect(menuButton()).toHaveAttribute("aria-describedby", "hint");
      await user.click(menuButton());
      expect(screen.getByRole("menu")).toHaveAttribute("data-admin-guide", "account-menu");
    });

    it("구조적 속성(aria-haspopup·role)은 덮어쓰지 못한다", async () => {
      const { user } = setup({
        accountButtonProps: { "aria-haspopup": "false" } as never,
        accountMenuProps: { role: "dialog" } as never,
      });
      expect(menuButton()).toHaveAttribute("aria-haspopup", "menu");
      await user.click(menuButton());
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("제어형 열림 (accountMenuOpen · onAccountMenuOpenChange)", () => {
    it("accountMenuOpen 을 주면 그 값대로 열리고 닫힌다", () => {
      const { rerender, onLogout } = setup({ accountMenuOpen: true });
      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(menuButton()).toHaveAttribute("aria-expanded", "true");
      rerender(
        <AppHeader
          logo={<span>APTA</span>}
          nav={[]}
          user={{ name: "김하늘", email: "sky@acme.com" }}
          accountItems={[SETTINGS]}
          onLogout={onLogout}
          accountMenuOpen={false}
        />,
      );
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("제어형이면 클릭은 onAccountMenuOpenChange 로 알리기만 하고 상태는 앱이 정한다", async () => {
      const onAccountMenuOpenChange = vi.fn();
      const { user } = setup({ accountMenuOpen: false, onAccountMenuOpenChange });
      await user.click(menuButton());
      expect(onAccountMenuOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("제어형으로 열린 메뉴에서 Escape 는 onAccountMenuOpenChange(false) 를 부른다", async () => {
      const onAccountMenuOpenChange = vi.fn();
      const { user } = setup({ accountMenuOpen: true, onAccountMenuOpenChange });
      await user.keyboard("{Escape}");
      expect(onAccountMenuOpenChange).toHaveBeenCalledWith(false);
    });

    it("비제어여도 onAccountMenuOpenChange 로 열림 변화를 알린다", async () => {
      const onAccountMenuOpenChange = vi.fn();
      const { user } = setup({ onAccountMenuOpenChange });
      await user.click(menuButton());
      expect(onAccountMenuOpenChange).toHaveBeenLastCalledWith(true);
      expect(screen.getByRole("menu")).toBeInTheDocument();
      await user.click(menuButton());
      expect(onAccountMenuOpenChange).toHaveBeenLastCalledWith(false);
    });
  });

  describe("바깥 누름 예외 (outsideClickIgnore)", () => {
    it("selector 에 맞는 요소 안을 누르면 닫지 않는다", async () => {
      const { user } = setup({
        outsideClickIgnore: "[data-admin-guide-overlay]",
        trailing: (
          <div data-admin-guide-overlay="">
            <button type="button">다음</button>
          </div>
        ),
      });
      await user.click(menuButton());
      await user.click(screen.getByRole("button", { name: "다음" }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
      // 예외 밖은 여전히 닫는다.
      fireEvent.mouseDown(screen.getByText("APTA"));
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  describe("머리 표면 덮어쓰기", () => {
    it("dataAttrs 는 머리(root)에 실린다 — 앱 CSS 가 data-scrolled 로 표면을 바꿀 수 있다", () => {
      setup({ dataAttrs: { "data-scrolled": "false" } });
      expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled", "false");
    });

    it("className 으로 배경·밑줄을 덮어쓰고 classNames.inner 로 안쪽 여백을 바꾼다", () => {
      setup({
        className: "bg-transparent lg:border-b-0",
        classNames: { inner: "px-3 sm:px-5" },
      });
      const bar = screen.getByRole("banner");
      expect(bar.className).toContain("bg-transparent");
      expect(bar.className).not.toContain("bg-background");
      expect(bar.className).not.toMatch(/(^|\s)lg:border-b(\s|$)/);
      const inner = bar.lastElementChild as HTMLElement;
      expect(inner.className).toContain("px-3");
      expect(inner.className).toContain("sm:px-5");
      expect(inner.className).not.toMatch(/(^|\s)px-5(\s|$)/);
    });

    it("기본은 이전과 같다 — 줄 글자색 --foreground, 이메일 --muted, 그림자 --overlay-shadow", async () => {
      const { user } = setup();
      await user.click(menuButton());
      const menu = screen.getByRole("menu");
      expect(menu.className).toContain("shadow-[var(--overlay-shadow)]");
      expect(screen.getByRole("menuitem", { name: "로그아웃" }).className).toContain(
        "text-[var(--foreground)]",
      );
      expect(within(menu).getByText("sky@acme.com").className).toContain("text-[var(--muted)]");
    });

    it("classNames 로 계정 메뉴 줄 색·이메일 색·그림자를 덮어쓴다", async () => {
      const { user } = setup({
        classNames: {
          accountMenu: "shadow-[var(--surface-shadow)]",
          accountRow: "text-[var(--muted)]",
          accountEmail: "text-[var(--muted-soft)]",
        },
      });
      await user.click(menuButton());
      const menu = screen.getByRole("menu");
      expect(menu.className).toContain("shadow-[var(--surface-shadow)]");
      expect(menu.className).not.toContain("--overlay-shadow");
      const logout = screen.getByRole("menuitem", { name: "로그아웃" });
      expect(logout.className).toContain("text-[var(--muted)]");
      expect(logout.className).not.toContain("--foreground");
      expect(logout.style.color).toBe("");
      const settings = screen.getByRole("menuitem", { name: /계정 설정/ });
      expect(settings.className).toContain("text-[var(--muted)]");
      const email = within(menu).getByText("sky@acme.com");
      expect(email.className).toContain("text-[var(--muted-soft)]");
      expect(email.style.color).toBe("");
    });
  });

  describe("nav 항목 · 로고 둘레", () => {
    it("badge 를 라벨 뒤에 그린다", () => {
      setup({
        nav: [
          { label: "할 일", href: "/todo", badge: 3 },
          { label: "강의", href: "/courses" },
        ],
      });
      const todo = screen.getByRole("link", { name: /할 일/ });
      expect(todo).toHaveAccessibleName(/^할 일\s?3$/);
      expect(todo.querySelector("[data-nav-badge]")).toHaveTextContent("3");
      expect(
        screen.getByRole("link", { name: "강의" }).querySelector("[data-nav-badge]"),
      ).toBeNull();
    });

    it("navActiveVariant 기본(bold)은 면 없이 굵기·글자색만 바꾼다", () => {
      setup();
      const on = screen.getByRole("link", { name: "응시 현황" });
      expect(on.style.fontWeight).toBe("700");
      expect(on.style.color).toBe("var(--foreground)");
      expect(on.style.background).toBe("");
    });

    it("navActiveVariant='soft' 는 accent-soft 면 + accent 글자로 지금 칸을 표시한다", () => {
      setup({ navActiveVariant: "soft" });
      const on = screen.getByRole("link", { name: "응시 현황" });
      expect(on.style.background).toBe("var(--accent-soft)");
      expect(on.style.color).toBe("var(--accent)");
      expect(on.style.fontWeight).toBe("600");
      const off = screen.getByRole("link", { name: "도움말" });
      expect(off.style.background).toBe("");
      expect(off.style.color).toBe("var(--muted)");
    });

    it("navReserveBoldWidth 면 굵은 폭을 미리 잡는다 — 접근 이름은 한 번만, 기본은 꺼짐", () => {
      const { unmount } = setup();
      expect(
        screen.getByRole("link", { name: "도움말" }).querySelector("[data-bold-reserve]"),
      ).toBeNull();
      unmount();
      setup({ navReserveBoldWidth: true });
      const link = screen.getByRole("link", { name: "도움말" });
      expect(link).toHaveAccessibleName("도움말");
      const reserve = link.querySelector("[data-bold-reserve]");
      expect(reserve).not.toBeNull();
      expect(reserve).toHaveAttribute("aria-hidden", "true");
    });

    it("brandTag 를 로고 옆에, leadingStart 를 로고 앞에 그린다", () => {
      setup({
        brandTag: "관리자",
        leadingStart: (
          <button type="button" aria-label="메뉴 열기">
            ≡
          </button>
        ),
      });
      const logo = screen.getByText("APTA");
      const tag = screen.getByText("관리자");
      const burger = screen.getByRole("button", { name: "메뉴 열기" });
      expect(burger.compareDocumentPosition(logo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(logo.compareDocumentPosition(tag) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(tag.closest("[data-brand-tag]")?.className).toContain("hidden");
      expect(tag.closest("[data-brand-tag]")?.className).toContain("sm:inline");
    });

    it("brandTag·leadingStart 가 없으면 그 자리를 그리지 않는다", () => {
      const { container } = setup();
      expect(container.querySelector("[data-brand-tag]")).toBeNull();
    });
  });
});
