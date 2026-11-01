import type { NavLinkRenderer, NavLinkRenderProps } from "./NavItem.js";
import type { FocusEventHandler, MouseEventHandler, ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

/**
 * 떠 있는 세로 레일 — 회사 사용자 화면의 주 메뉴. 정본은 axhub-frontend
 * `layout/RailSidebar.tsx`·`RailTile.tsx` (Figma 10646:4764 · 10661:4832).
 *
 * 관리자 화면의 넓은 사이드바(`Sidebar` + `NavList`)와 짝이다: 같은 hover 면 색·
 * primary 활성 글자를 쓰고, 모양만 52×52 타일로 다르다.
 *
 * 껍데기: 면 `bg-content` 60%(뒤 오로라가 비침) · 1px 보더 · 12px 라운드 · 8px 패딩 ·
 * 항목 간 8px · 그림자 0 0 12 5%. 놓는 자리(콘텐츠 왼쪽 32 · 상단 바 아래 32)는 앱 셸이 정한다.
 */
export interface RailProps {
  children: ReactNode;
  /** 구분선 아래 고정 영역 — 정본은 「설정」 타일 하나를 둔다. 주면 구분선이 같이 그려진다. */
  footer?: ReactNode;
  "aria-label"?: string;
  className?: string;
}

export function Rail({
  children,
  footer,
  "aria-label": ariaLabel = "주 메뉴",
  className,
}: RailProps): ReactElement {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "bg-content/60 border-default flex flex-col gap-2 rounded-[12px] border p-2 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      {children}
      {footer ? (
        <>
          <div role="separator" className="border-default mx-2 border-t" />
          {footer}
        </>
      ) : null}
    </nav>
  );
}

/**
 * 타일 클래스 — 52×52, 면 색은 hover 에만. 활성은 글자·아이콘 색(primary)으로만 구분한다.
 * 라우터의 `NavLink` 처럼 활성 판정을 직접 하는 소비자는 이것과 `RailTileContent` 로 그린다.
 */
export function railTileClass(active: boolean, className?: string): string {
  return cn(
    "flex size-[52px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 transition-colors",
    "hover:bg-[var(--opacity-gray-50)] dark:hover:bg-[var(--opacity-white-50)]",
    "focus-visible:ring-focus focus-visible:ring-2 focus-visible:outline-none",
    active ? "text-primary" : "text-gray-400",
    className,
  );
}

export interface RailTileContentProps {
  /** 24px 아이콘. 활성 여부에 따라 색·채움이 바뀌는 아이콘이 많아 노드로 받는다. */
  icon: ReactNode;
  label: ReactNode;
  active: boolean;
}

/** 타일 안쪽 — 아이콘 24 위 12px 라벨. 활성은 semibold. */
export function RailTileContent({ icon, label, active }: RailTileContentProps): ReactElement {
  return (
    <>
      {icon}
      <span
        className={cn(
          "text-[12px] leading-none tracking-[-0.12px] whitespace-nowrap",
          active ? "font-semibold" : "font-normal",
        )}
      >
        {label}
      </span>
    </>
  );
}

export interface RailTileProps {
  /** 목적지. 없으면 링크 없이 모습만 그린다(메뉴 미리보기). */
  href?: string;
  label: ReactNode;
  active?: boolean;
  renderLink?: NavLinkRenderer;
  dataAttrs?: Record<`data-${string}`, string | undefined>;
  className?: string;
  /** 활성 여부를 받아 24px 아이콘을 그린다. */
  renderIcon: (active: boolean) => ReactNode;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

export function RailTile({
  href,
  renderIcon,
  label,
  active = false,
  renderLink = DEFAULT_LINK,
  dataAttrs,
  className,
  onMouseEnter,
  onFocus,
}: RailTileProps): ReactElement {
  const children = <RailTileContent icon={renderIcon(active)} label={label} active={active} />;
  if (!href) {
    return <div className={railTileClass(active, className)}>{children}</div>;
  }
  return renderLink({
    ...dataAttrs,
    href,
    className: railTileClass(active, className),
    "aria-current": active ? "page" : undefined,
    onMouseEnter,
    onFocus,
    children,
  } as NavLinkRenderProps);
}
