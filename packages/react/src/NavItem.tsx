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
  // 키를 `data-*` 로 제한한다 — `href`/`className`/`style`/`aria-current` 처럼
  // renderLink 뒤에 스프레드되는 구조적 prop 이 여기로 몰래 들어와 덮어쓰지 못하게
  // 타입 단계에서 막는다 (Task 10 리뷰 Minor).
  dataAttrs?: Record<`data-${string}`, string | undefined>;
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
    "focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    active
      ? "font-semibold"
      : "text-default hover:bg-[var(--opacity-gray-50)] dark:hover:bg-[var(--opacity-white-50)]",
    className,
  );
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/**
 * NavItem 의 렌더 본체 — 클래스 문자열 생성만 `classFn` 으로 갈아끼울 수 있게 뺐다.
 * 공개 `NavItem` 은 `itemClass` 로 이걸 호출한다. `NavList` 의 아코디언 **자식** 행은
 * 정본(InnerSidebar.tsx:261-266)의 별도 클래스 세트를 쓰므로 여기로 `childItemClass` 를
 * 넘겨 재사용한다 — 공개 API(`NavItemProps`)에 size/variant 를 추가하지 않기 위해
 * `index.ts` 로는 export 하지 않고 패키지 내부(`NavList.tsx`)에서만 가져다 쓴다.
 */
export function renderNavItem(
  {
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
  }: NavItemProps,
  classFn: (active: boolean, className?: string) => string,
): ReactElement {
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
      {/*
        라벨 span 은 정본을 그대로 따른다.
        - 링크: `flex-1 truncate` (axhub-frontend InnerSidebar.tsx:310)
        - 버튼: `flex-1 truncate text-left` (같은 파일 236) — <button> 의 UA
          `text-align:center` 를 되돌리는 자리라 링크에는 없다.
        `min-w-0` 은 정본 어느 쪽에도 없어 뺐다. truncate 의 `overflow:hidden` 이
        이미 flex 자동 최소 크기를 0 으로 만들기 때문에 계산 결과도 같다.
      */}
      <span className={href ? "flex-1 truncate" : "flex-1 truncate text-left"}>{label}</span>
      {badge}
    </>
  );

  if (href) {
    return renderLink({
      href,
      className: classFn(active, className),
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
      className={classFn(active, className)}
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

/**
 * 사이드바 내비게이션 항목 하나.
 *
 * 접근성은 API 모양으로 강제된다 — 이 컴포넌트로는 `<div onClick>` 을 만들 수 없다.
 * href 가 있으면 링크, 없고 onSelect 만 있으면 button 이고, 둘 다 없으면 던진다.
 * 활성 표현은 정본(AxHub Figma)을 따라 **배경 없이 색만** 바꾼다 — APTA 가 쓰던
 * `--accent-soft` 배경 방식은 여기로 올라오지 않는다.
 */
export function NavItem(props: NavItemProps): ReactElement {
  return renderNavItem(props, itemClass);
}
