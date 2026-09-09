import type { Icon, IconWeight } from "./lib/icon.js";
import type {
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";

import { cn } from "./lib/cn.js";

export interface NavLinkRenderProps {
  href: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
  "aria-current"?: "page";
  "aria-selected"?: boolean;
  role?: string;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
}

/**
 * 라우터의 Link 를 주입하는 자리. 패키지는 react-router 에 의존하지 않는다 —
 * AxHub 는 react-router-dom, APTA 는 react-router 를 쓰므로 여기가 유일한 접점이다.
 */
export type NavLinkRenderer = (props: NavLinkRenderProps) => ReactElement;

export interface NavItemProps {
  /** 목적지. 주면 링크(<a>)로 렌더한다. */
  href?: string;
  icon?: Icon;
  iconWeight?: IconWeight;
  label: ReactNode;
  active?: boolean;
  /** 활성 텍스트 색. 화이트라벨 테넌트가 자기 색을 넣는 자리. 기본은 정본 primary. */
  activeColor?: string;
  badge?: ReactNode;
  renderLink?: NavLinkRenderer;
  dataAttrs?: Record<string, string | undefined>;
  className?: string;
  /** 목적지가 없는 동작. 주면 <button type="button"> 으로 렌더한다. */
  onSelect?: () => void;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
}

/**
 * axhub-frontend InnerSidebar 의 navItemClass 를 그대로 승격한 것.
 * NavList 의 아코디언 트리거 버튼도 같은 클래스가 필요해 export 한다.
 */
export function itemClass(active: boolean, className?: string) {
  return cn(
    "flex h-[32px] w-full items-center gap-[8px] rounded-[8px] border border-transparent px-[12px] text-[14px] transition-colors",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    active
      ? "font-semibold"
      : "text-default hover:bg-[var(--opacity-gray-50)] dark:hover:bg-[var(--opacity-white-50)]",
    className,
  );
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/**
 * 사이드바 내비게이션 항목 하나.
 *
 * 접근성은 API 모양으로 강제된다 — 이 컴포넌트로는 `<div onClick>` 을 만들 수 없다.
 * href 가 있으면 링크, 없고 onSelect 만 있으면 button 이고, 둘 다 없으면 던진다.
 * 활성 표현은 정본(AxHub Figma)을 따라 **배경 없이 색만** 바꾼다 — APTA 가 쓰던
 * `--accent-soft` 배경 방식은 여기로 올라오지 않는다.
 */
export function NavItem({
  href,
  onSelect,
  icon: IconComponent,
  iconWeight,
  label,
  active = false,
  activeColor,
  badge,
  renderLink = DEFAULT_LINK,
  dataAttrs,
  className,
  onMouseEnter,
  onFocus,
}: NavItemProps): ReactElement {
  if (!href && !onSelect) {
    throw new Error(
      "NavItem: href 또는 onSelect 중 하나는 있어야 합니다. 접근 가능한 요소를 만들 수 없습니다.",
    );
  }

  const style: CSSProperties | undefined = active
    ? { color: activeColor ?? "var(--primary)" }
    : undefined;

  const body = (
    <>
      {IconComponent ? (
        <IconComponent
          aria-hidden="true"
          weight={iconWeight}
          className="h-[18px] w-[18px] shrink-0"
          style={active ? undefined : { color: "var(--icon-inactive)" }}
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {badge}
    </>
  );

  if (href) {
    return renderLink({
      href,
      className: itemClass(active, className),
      style,
      "aria-current": active ? "page" : undefined,
      onMouseEnter,
      onFocus,
      children: body,
      ...dataAttrs,
    } as NavLinkRenderProps);
  }

  return (
    <button
      type="button"
      className={itemClass(active, className)}
      style={style}
      aria-current={active ? "page" : undefined}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      {...dataAttrs}
    >
      {body}
    </button>
  );
}
