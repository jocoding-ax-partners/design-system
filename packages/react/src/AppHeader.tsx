import type { NavLinkRenderer } from "./NavItem.js";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { cn } from "./lib/cn.js";
import { TopBar } from "./TopBar.js";

export interface AppHeaderNavItem {
  label: string;
  href: string;
  /** 지금 보고 있는 칸. 경로 비교는 앱이 한다 — 패키지는 라우터를 모른다. */
  active?: boolean;
  /**
   * 라벨 뒤 작은 표시(할 일 수 등). 알약으로 칠하지 않고 글자만 — 지금 칸이면 `--accent`,
   * 아니면 `--muted-soft`(없으면 `--muted`). 0·빈 값은 앱이 걸러서 넘긴다.
   */
  badge?: ReactNode;
}

/**
 * 상단 메뉴 지금 칸의 표시. `bold`(기본)는 면 없이 굵기 700 + `--foreground` 글자 —
 * AxLMS 학습자 GNB. `soft` 는 `--accent-soft` 면 + `--accent` 글자 + 굵기 600 —
 * AxLMS 운영자 GNB·사이드 레일 선택 행과 같은 표시.
 */
export type AppHeaderNavActiveVariant = "bold" | "soft";

/** 계정 버튼·계정 메뉴에 그대로 싣는 속성. `data-*`·`aria-*` 만 받는다. */
export type AppHeaderPassthroughAttrs = Partial<
  Record<`data-${string}` | `aria-${string}`, string | undefined>
>;

/**
 * 표면 덮어쓰기 클래스 슬롯. 모두 기본 클래스 **뒤**에 붙어 twMerge 로 같은 속성을 이긴다.
 * 머리 자체의 배경·밑줄은 `className` 으로 덮는다(예: `bg-transparent lg:border-b-0`).
 */
export interface AppHeaderClassNames {
  /** 머리 안쪽 행 — 좌우 여백(기본 `px-5`). 예: `px-3 sm:px-5`. */
  inner?: string;
  /** 계정 메뉴 상자 — 그림자(기본 `shadow-[var(--overlay-shadow)]`)·테두리 등. */
  accountMenu?: string;
  /** 계정 메뉴 링크·로그아웃 줄 — 글자색(기본 `text-[var(--foreground)]`) 등. */
  accountRow?: string;
  /** 계정 메뉴 머리의 이메일 줄 — 글자색(기본 `text-[var(--muted)]`) 등. */
  accountEmail?: string;
}

export interface AppHeaderUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AppHeaderAccountItem {
  label: string;
  href: string;
  /** 새 창(`target="_blank"`, `rel="noreferrer"`)으로 연다 — 허브 계정 설정처럼 앱 밖으로 가는 줄. */
  external?: boolean;
}

export interface AppHeaderProps {
  /** 왼쪽 끝 로고. TopBar 의 `leading` 에 둔다 — `rail` 은 lg 미만에서 숨는다. */
  logo: ReactNode;
  /** 상단 메뉴. 비면 내비게이션 랜드마크를 그리지 않는다. */
  nav: AppHeaderNavItem[];
  user: AppHeaderUser;
  /**
   * 계정 메뉴의 링크 줄(로그아웃 위). 계정 설정·표면 전환(관리자 페이지 ↔ 응시 현황)을
   * **앱이 이미 거른 목록**으로 준다 — 이 컴포넌트는 권한을 판정하지 않는다.
   */
  accountItems: AppHeaderAccountItem[];
  /** 라우터 Link 주입 자리 — NavItem 과 같은 계약. 없으면 평범한 `<a>`. */
  renderLink?: NavLinkRenderer;
  /** 계정 버튼 앞 슬롯 — 알림 종·테마 토글. */
  trailing?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 로고 **앞** 슬롯 — 좁은 화면의 메뉴 서랍 햄버거 자리. 보임·숨김은 앱이 정한다. */
  leadingStart?: ReactNode;

  // ── 아래는 모두 선택 prop 이다. 넘기지 않으면 위 기본 동작·모양 그대로다. ──

  /** 로고 옆 표면 이름표(예: 「관리자」). sm 미만에서는 숨는다. */
  brandTag?: ReactNode;
  /** 상단 메뉴 지금 칸의 표시. 기본 `bold`. */
  navActiveVariant?: AppHeaderNavActiveVariant;
  /**
   * 상단 메뉴 라벨 폭을 지금 칸의 굵기로 미리 잡는다 — 칸이 바뀌어도 옆 메뉴가 밀리지 않는다
   * (AxLMS `BoldReserve`). 기본 꺼짐.
   */
  navReserveBoldWidth?: boolean;
  /** `<header>` 에 싣는 `data-*` — 앱 CSS 가 `data-scrolled` 같은 상태로 표면을 바꾸는 자리. */
  dataAttrs?: Record<`data-${string}`, string | undefined>;
  /** 안쪽 여백·계정 메뉴 줄 색·이메일 색·그림자를 덮어쓰는 클래스 슬롯. */
  classNames?: AppHeaderClassNames;
  /** 계정 버튼에 싣는 `data-*`·`aria-*`. 구조적 속성(aria-haspopup·aria-expanded 등)은 못 덮는다. */
  accountButtonProps?: AppHeaderPassthroughAttrs;
  /** 계정 메뉴(role=menu) 상자에 싣는 `data-*`·`aria-*`. role·id 는 못 덮는다. */
  accountMenuProps?: AppHeaderPassthroughAttrs;
  /**
   * 계정 메뉴 열림 — 주면 **제어형**이다. 버튼·Esc·바깥 누름·항목 선택은
   * `onAccountMenuOpenChange` 로 알리기만 하고 열림은 이 값을 따른다. 앱이 열면(예: 안내
   * 투어) 포커스를 옮기지 않는다. 없으면 지금처럼 안에서 연다.
   */
  accountMenuOpen?: boolean;
  /**
   * 바깥 누름 예외 CSS selector. 누른 곳이 이 selector 에 맞는 요소 안이면 메뉴를 닫지
   * 않는다(예: `[data-admin-guide-overlay]` — 메뉴를 비추는 안내 투어).
   */
  outsideClickIgnore?: string;
  /** 로그아웃. Promise 를 돌려주면 끝날 때까지 줄을 막고, reject 하면 메뉴 안에 한 줄을 남긴다. */
  onLogout: () => Promise<void> | void;
  /** 계정 메뉴 열림이 바뀌어야 할 때 — 제어형·비제어 모두 부른다. */
  onAccountMenuOpenChange?: (open: boolean) => void;
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/**
 * 상단 메뉴 한 칸 — AxLMS 학습자 GNB(components/shell/app-header.tsx:338-372)의 모양.
 * 지금 칸은 면 없이 굵기·글자색만 바뀐다. 호버 면은 바의 다른 단추와 같은
 * `--opacity-gray-50`(NavItem 과 같은 값), 포커스 링은 NavItem 과 같은 `ring-focus`.
 */
const NAV_LINK =
  "flex min-h-11 flex-none items-center rounded-lg px-3 text-sm transition-colors duration-150 hover:bg-[var(--opacity-gray-50)] md:min-h-9 dark:hover:bg-[var(--opacity-white-50)] focus-visible:ring-focus focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

/** 계정 메뉴 한 줄 — AxLMS `ACCOUNT_ROW`(app-header.tsx:872-873)에 포커스 표시를 더했다. */
const ACCOUNT_ROW =
  "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-[16px] leading-[1.5] tracking-[-0.16px] text-[var(--foreground)] transition-colors duration-150 hover:bg-[var(--opacity-gray-50)] focus:bg-[var(--opacity-gray-50)] focus:outline-none dark:hover:bg-[var(--opacity-white-50)] dark:focus:bg-[var(--opacity-white-50)]";

/** 지금 칸 표시 변형별 글자색·굵기·면. */
const NAV_ACTIVE: Record<
  AppHeaderNavActiveVariant,
  { weight: number; on: CSSProperties; off: CSSProperties }
> = {
  bold: {
    weight: 700,
    on: { color: "var(--foreground)", fontWeight: 700 },
    off: { color: "var(--muted)", fontWeight: 500 },
  },
  soft: {
    weight: 600,
    on: { color: "var(--accent)", fontWeight: 600, background: "var(--accent-soft)" },
    off: { color: "var(--muted)", fontWeight: 500 },
  },
};

/**
 * 라벨 폭을 굵은 폭으로 미리 잡는다 — 같은 칸에 굵은 복사본을 보이지 않게 겹쳐 둔다.
 * 복사본은 aria-hidden 이라 접근 이름은 한 번만 읽힌다.
 */
function BoldReserve({ weight, children }: { weight: number; children: ReactNode }): ReactElement {
  return (
    <span className="inline-grid">
      <span style={{ gridArea: "1 / 1" }}>{children}</span>
      <span
        aria-hidden="true"
        data-bold-reserve=""
        className="invisible"
        style={{ gridArea: "1 / 1", fontWeight: weight }}
      >
        {children}
      </span>
    </span>
  );
}

type LogoutState = "idle" | "busy" | "failed";

function menuItems(menu: HTMLElement | null): HTMLElement[] {
  if (!menu) {
    return [];
  }
  return Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (el) => !(el as HTMLButtonElement).disabled,
  );
}

/**
 * 계정 버튼과 계정 메뉴. 넓은 화면(md 이상)은 버튼 아래 240px 팝오버, 좁은 화면은
 * 어두운 막 위에 아래에서 올라오는 바텀시트다(AxLMS app-header.tsx:560-720).
 *
 * 키보드는 WAI-ARIA 메뉴 버튼 패턴을 따른다 — Enter·Space·↓ 로 열면 첫 줄, ↑ 로 열면
 * 마지막 줄에 포커스. 안에서는 ↑↓ 가 돌고 Home/End 가 양끝, Esc 는 닫고 버튼으로
 * 포커스를 돌려주고, Tab 은 닫으며 다음 자리로 나간다. 줄은 roving tabindex(-1)다.
 */
function AccountMenu({
  user,
  items,
  onLogout,
  renderLink,
  classNames,
  buttonProps,
  menuProps,
  openProp,
  onOpenChange,
  outsideClickIgnore,
}: {
  user: AppHeaderUser;
  items: AppHeaderAccountItem[];
  renderLink: NavLinkRenderer;
  classNames?: AppHeaderClassNames;
  buttonProps?: AppHeaderPassthroughAttrs;
  menuProps?: AppHeaderPassthroughAttrs;
  openProp?: boolean;
  outsideClickIgnore?: string;
  onLogout: () => Promise<void> | void;
  onOpenChange?: (open: boolean) => void;
}): ReactElement {
  const [innerOpen, setInnerOpen] = useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;
  // 콜백을 ref 로 들고 있어 close 가 매 렌더 바뀌지 않게 한다(바깥 누름 effect 재구독 방지).
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);
  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) {
        setInnerOpen(next);
      }
      onOpenChangeRef.current?.(next);
    },
    [controlled],
  );
  const [bye, setBye] = useState<LogoutState>("idle");
  // 열린 직후 어디에 포커스를 둘지. 마우스로 열면 메뉴 상자 자체에 둬서 ↑↓ 가 바로 먹게 한다.
  // 버튼·키보드로 연 경우에만 값이 있다 — 앱이 제어형으로 연 경우(안내 투어 등)는 포커스를 옮기지 않는다.
  const focusOnOpen = useRef<"first" | "last" | "menu" | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const display = user.name || user.email;

  const close = useCallback(
    (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) {
        buttonRef.current?.focus();
      }
    },
    [setOpen],
  );

  const openWith = (target: "first" | "last" | "menu") => {
    focusOnOpen.current = target;
    setOpen(true);
  };

  // 열린 뒤: 줄들을 roving tabindex 로 묶고 포커스를 놓는다. 줄 중 링크는 앱의
  // renderLink 가 그리므로 tabIndex 를 props 로 강제할 수 없어 DOM 에서 맞춘다.
  useEffect(() => {
    if (!open) {
      return;
    }
    const menu = menuRef.current;
    const all = menu ? Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];
    for (const el of all) {
      el.tabIndex = -1;
    }
    const list = menuItems(menu);
    const target = focusOnOpen.current;
    focusOnOpen.current = null;
    if (target === "first") {
      list[0]?.focus();
    } else if (target === "last") {
      list[list.length - 1]?.focus();
    } else if (target === "menu") {
      menu?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onDown(e: MouseEvent) {
      // 예외 selector 안을 누른 건 바깥이 아니다 — 메뉴를 비추는 안내 투어 같은 자리.
      if (
        outsideClickIgnore &&
        e.target instanceof Element &&
        e.target.closest(outsideClickIgnore)
      ) {
        return;
      }
      if (!boxRef.current?.contains(e.target as Node)) {
        close(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // 포커스가 메뉴 안이었을 때만 버튼으로 돌려준다 — 다른 데서 일하던 포커스를 뺏지 않는다.
        const inside = boxRef.current?.contains(document.activeElement);
        close(inside ?? false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, outsideClickIgnore]);

  const onButtonKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openWith("first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openWith("last");
    }
  };

  const onMenuKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const list = menuItems(menuRef.current);
    if (list.length === 0) {
      return;
    }
    const at = list.indexOf(document.activeElement as HTMLElement);
    let next: number | null = null;
    switch (e.key) {
      case "ArrowDown":
        next = at < 0 ? 0 : (at + 1) % list.length;
        break;
      case "ArrowUp":
        next = at < 0 ? list.length - 1 : (at - 1 + list.length) % list.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = list.length - 1;
        break;
      case "Tab":
        // 기본 동작(다음 자리로 이동)은 그대로 두고 메뉴만 닫는다.
        close(false);
        return;
      default:
        return;
    }
    e.preventDefault();
    list[next]?.focus();
  };

  // 링크 줄을 누르면 닫는다. 링크는 앱의 renderLink 가 그려 onClick 을 실을 수 없어서
  // 메뉴 상자에서 버블링으로 받는다. 로그아웃(button)은 결과를 보여 줘야 하므로 제외.
  const onMenuClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const row = (e.target as HTMLElement).closest('a[role="menuitem"]');
    if (row) {
      close(false);
    }
  };

  const logout = async () => {
    if (bye === "busy") {
      return;
    }
    setBye("busy");
    try {
      await onLogout();
      setBye("idle");
    } catch {
      setBye("failed");
    }
  };

  return (
    <div className="relative flex-none" ref={boxRef}>
      <button
        {...buttonProps}
        ref={buttonRef}
        type="button"
        aria-label={`계정 메뉴 · ${display}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close(false) : openWith("menu"))}
        onKeyDown={onButtonKeyDown}
        onKeyUp={(e) => {
          // Space 는 keyup 에서 click 을 만든다 — keydown 에서 이미 열었으니 막는다.
          if (e.key === " ") {
            e.preventDefault();
          }
        }}
        className="focus-visible:ring-focus focus-visible:ring-offset-background flex min-h-11 min-w-11 cursor-pointer items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors duration-200 hover:bg-[var(--opacity-gray-50)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:min-h-0 dark:hover:bg-[var(--opacity-white-50)]"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="size-7 flex-none rounded-full object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-7 flex-none items-center justify-center rounded-full text-xs font-bold"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {(display || "?").slice(0, 1)}
          </span>
        )}
        <span aria-hidden="true" className="hidden text-sm font-medium sm:inline">
          {display}
        </span>
      </button>

      {open ? (
        <div
          aria-hidden="true"
          data-account-menu-scrim=""
          onClick={() => close(false)}
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "var(--backdrop, rgb(22 23 27 / 0.4))" }}
        />
      ) : null}
      {open ? (
        <div
          {...menuProps}
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="계정 메뉴"
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          onClick={onMenuClick}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 rounded-t-[20px] p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[var(--overlay-shadow)] outline-none md:absolute md:inset-x-auto md:top-11 md:right-0 md:bottom-auto md:w-[240px] md:rounded-xl md:p-3",
            classNames?.accountMenu,
          )}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* 바텀시트 손잡이 — 좁은 화면에서만. */}
          <span
            aria-hidden="true"
            className="mx-auto block h-1 w-9 rounded-full md:hidden"
            style={{ background: "var(--border)" }}
          />
          <div className="flex min-w-0 flex-col gap-1 px-3 py-2">
            <p className="truncate text-[18px] leading-[1.4] font-semibold tracking-[-0.18px]">
              {display}
            </p>
            {user.email && user.name ? (
              <p
                className={cn(
                  "truncate text-[14px] leading-[1.5] tracking-[-0.14px] text-[var(--muted)]",
                  classNames?.accountEmail,
                )}
              >
                {user.email}
              </p>
            ) : null}
          </div>
          <div role="none" style={{ borderTop: "1px solid var(--separator)" }} />
          <div role="none" className="flex flex-col">
            {items.map((item, i) => (
              <ItemKey key={`${item.href}-${i}`}>
                {renderLink({
                  href: item.href,
                  role: "menuitem",
                  className: cn(
                    ACCOUNT_ROW,
                    item.external && "justify-between gap-2",
                    classNames?.accountRow,
                  ),
                  ...(item.external ? { target: "_blank", rel: "noreferrer" } : {}),
                  children: item.external ? (
                    <>
                      <span>{item.label}</span>{" "}
                      <span className="text-[13px]" style={{ color: "var(--muted)" }}>
                        새 창 <span aria-hidden="true">↗</span>
                      </span>
                    </>
                  ) : (
                    item.label
                  ),
                })}
              </ItemKey>
            ))}
            {/* 로그아웃은 누구에게나 있다 — 갈 곳이 아니라 동작이라 button 이다. */}
            <button
              type="button"
              role="menuitem"
              disabled={bye === "busy"}
              onClick={() => void logout()}
              className={cn(ACCOUNT_ROW, "disabled:opacity-60", classNames?.accountRow)}
            >
              {bye === "busy" ? "로그아웃 중…" : "로그아웃"}
            </button>
            {bye === "failed" ? (
              <p
                role="alert"
                className="px-3 pb-1 text-[13px] leading-[1.5]"
                style={{ color: "var(--danger)" }}
              >
                지금은 로그아웃할 수 없어요. 잠시 뒤 다시 눌러 주세요.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** renderLink 가 돌려준 엘리먼트에 key 를 달기 위한 껍데기 — DOM 을 더하지 않는다. */
function ItemKey({ children }: { children: ReactElement }): ReactElement {
  return children;
}

/**
 * 제품 공통 GNB — 화면 맨 위 전체폭 머리. `TopBar` 를 감싸 왼쪽(`leading`)에 로고와
 * 상단 메뉴, 오른쪽(`actions`)에 `trailing` 슬롯과 계정 버튼·계정 메뉴를 그린다.
 * 모양 기준은 AxLMS `components/shell/app-header.tsx`.
 *
 * 권한을 판정하지 않는다 — 관리자 페이지로 건너가는 줄을 보일지는 앱이 `accountItems`
 * 로 정한다. 높이는 새 토큰 없이 앱이 준 `--gnb-h` 를 먼저 읽고, 없으면 TopBar 의
 * `--topbar-height` 로 떨어진다. 상단 메뉴는 AxLMS 처럼 md 미만에서 숨는다.
 */
export function AppHeader({
  logo,
  nav,
  user,
  accountItems,
  onLogout,
  renderLink = DEFAULT_LINK,
  trailing,
  className,
  style,
  leadingStart,
  brandTag,
  navActiveVariant = "bold",
  navReserveBoldWidth = false,
  dataAttrs,
  classNames,
  accountButtonProps,
  accountMenuProps,
  accountMenuOpen,
  onAccountMenuOpenChange,
  outsideClickIgnore,
}: AppHeaderProps): ReactElement {
  const active = NAV_ACTIVE[navActiveVariant];
  return (
    <TopBar
      className={cn("h-[var(--gnb-h,var(--topbar-height))]", className)}
      style={style}
      innerClassName={classNames?.inner}
      dataAttrs={dataAttrs}
      leading={
        <>
          {leadingStart}
          <div className="flex flex-none items-center">{logo}</div>
          {brandTag ? (
            // 표면 이름표 — 제품 이름이 주인공이고 이건 꼬리표라 무게를 낮춘다. 좁은 화면에서는
            // 오른쪽 무리를 밀어내므로 숨긴다(AxLMS app-header.tsx brandTag).
            <span
              data-brand-tag=""
              className="hidden flex-none rounded-md px-1.5 py-0.5 text-[11px] font-semibold sm:inline"
              style={{ background: "var(--background-tertiary)", color: "var(--muted)" }}
            >
              {brandTag}
            </span>
          ) : null}
          {nav.length > 0 ? (
            <nav aria-label="주 메뉴" className="hidden items-center gap-2 md:flex">
              {nav.map((item) => (
                <ItemKey key={item.href}>
                  {renderLink({
                    href: item.href,
                    className: NAV_LINK,
                    style: item.active ? active.on : active.off,
                    "aria-current": item.active ? "page" : undefined,
                    children: (
                      <>
                        {navReserveBoldWidth ? (
                          <BoldReserve weight={active.weight}>{item.label}</BoldReserve>
                        ) : (
                          item.label
                        )}
                        {item.badge !== undefined && item.badge !== null && item.badge !== false ? (
                          <span
                            data-nav-badge=""
                            className="ml-1.5 text-xs font-bold"
                            style={{
                              color: item.active
                                ? "var(--accent)"
                                : "var(--muted-soft, var(--muted))",
                            }}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ),
                  })}
                </ItemKey>
              ))}
            </nav>
          ) : null}
        </>
      }
      actions={
        <>
          {trailing}
          <AccountMenu
            user={user}
            items={accountItems}
            onLogout={onLogout}
            renderLink={renderLink}
            classNames={classNames}
            buttonProps={accountButtonProps}
            menuProps={accountMenuProps}
            openProp={accountMenuOpen}
            onOpenChange={onAccountMenuOpenChange}
            outsideClickIgnore={outsideClickIgnore}
          />
        </>
      }
    />
  );
}
