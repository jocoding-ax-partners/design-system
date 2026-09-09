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
  // 타입 단계에서 막는다. 다만 객체 리터럴만 막는다 — `Record<string, string>` 으로
  // 타입된 변수나 함수 반환값은 이 narrowing 을 통과하므로, 실제 방어선은
  // `renderNavItem` 에서 `...dataAttrs` 를 구조적 prop **앞에** 스프레드하는 순서다
  // (Task 10 재리뷰 Minor — 타입만으로는 부족하다는 게 `tsc --strict` 로 실측됐다).
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
 *
 * 첫 줄이 정본(InnerSidebar.tsx:128-133)이고, 둘째 줄의 `focus-visible:*` 는 정본에
 * 없는 **패키지가 더하는 접근성 확장**이다. 링 색은 `ring-focus` 로 고정한다 —
 * 색을 안 주면 Tailwind 기본값 `currentColor` 라 링이 그 자리 글자색을 따라가고,
 * 항목마다(활성=primary, 비활성=text-default) 색이 달라져 포커스 어포던스가 하나로
 * 안 읽힌다. 번들에 실려 나가는 다른 포커스 링은 전부 `var(--focus)` 다 —
 * `@heroui/styles` dist 실측(2026-09-09): `--tw-ring-color:var(--focus)` 47건 +
 * `outline-color:var(--focus)` 2건, `currentColor` 0건. `ring-focus` 가 해석되는
 * 경로도 확인했다: `@heroui/styles/dist/themes/shared/theme.css:28` 의
 * `--color-focus: var(--focus)` 와 `themes/default/variables.css:95,227` 의
 * `--focus: var(--accent)`(라이트·다크 양쪽). 즉 아무 데도 안 걸려 투명해지지 않는다.
 *
 * **`TabNav` 는 여기 안 따른다. 일부러다.** 이 규칙이 적용되는 자리는 정본에 링이
 * 아예 없어서 줄 전체가 패키지 창작인 곳(`NavItem`·`PageHeader`·`Breadcrumbs`)뿐이다.
 * `TabNav` 는 정본(axhub-frontend tab-page/ui/TabNav.tsx:35)이 이미 링을 갖고 있고
 * 색을 주지 않기로 했으므로 그 결정을 따른다 — AxHub 가 오늘 프로덕션에서 그리는
 * 표면을 사람 승인 없이 리팩 경로로 바꾸지 않는다. 넷이 색이 갈리는 건 인지된
 * 결과이고, 통일 여부는 사람이 정할 문제로 남겨 뒀다.
 */
export function itemClass(active: boolean, className?: string) {
  return cn(
    "flex h-[32px] w-full items-center gap-[8px] rounded-[8px] border border-transparent px-[12px] text-[14px] transition-colors",
    "focus-visible:ring-focus focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
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
  // 아코디언 **자식** 행 전용. 정본(axhub-frontend InnerSidebar.tsx:261-269,
  // commit bc1e87cf)은 라벨을 span 으로 감싸지 않는 맨 텍스트 노드로 렌더한다 —
  // `truncate`(white-space:nowrap) 가 없어 긴 라벨이 줄바꿈된다. bareLabel 은
  // 그 한 곳만을 위한 스위치이고, 부모 행(itemClass)에는 쓰지 않는다
  // (Task 10 재리뷰 Important).
  bareLabel = false,
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
      {bareLabel ? (
        label
      ) : (
        <span className={href ? "flex-1 truncate" : "flex-1 truncate text-left"}>{label}</span>
      )}
      {badge}
    </>
  );

  if (href) {
    return renderLink({
      // dataAttrs 를 맨 앞에 둔다 — 뒤따르는 구조적 prop(href/className/style/
      // aria-current)이 항상 이긴다. 타입 narrowing(`Record<`data-${string}`, …>`)은
      // 객체 리터럴만 막고 `Record<string, string>` 으로 타입된 변수는 통과시켜서
      // (Task 10 재리뷰 Minor) spread 순서가 실제 방어선이다.
      ...dataAttrs,
      href,
      className: classFn(active, className),
      style,
      "aria-current": active ? "page" : undefined,
      onMouseEnter,
      onFocus,
      children: body,
    } as NavLinkRenderProps);
  }

  return (
    <button
      type="button"
      {...dataAttrs}
      className={classFn(active, className)}
      style={style}
      aria-current={active ? "page" : undefined}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
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
