import { CaretRight } from "@phosphor-icons/react";
import { useState, Fragment, type CSSProperties, type ReactElement, type ReactNode } from "react";

import { cn } from "./lib/cn.js";
import {
  itemClass,
  renderNavItem,
  NavItem,
  type NavItemProps,
  type NavLinkRenderer,
} from "./NavItem.js";

/**
 * 아코디언 **자식** 행 전용 클래스 — 정본(axhub-frontend InnerSidebar.tsx:261-266,
 * commit bc1e87cf)을 한 글자씩 옮긴 것이다. 부모 행(`itemClass`)보다 한 단계
 * 작다: 고정 높이가 없고, 반경 6px·패딩 10/6px·글자 13px. 공개 API 에 size/variant
 * 를 추가하지 않기 위해 `index.ts` 로 export 하지 않는다.
 *
 * 다만 호출자가 완전히 못 닿는 건 아니다 — `NavEntry` 가 `NavItemProps` 의
 * `className` 을 그대로 물려받고(`toItemProps`), `childItemClass(active, className)`
 * 가 그 값을 뒤에 이어붙인다. 그래서 `children: [{ …, className: 'text-[14px] h-[32px]' }]`
 * 처럼 호출자가 부모 행 크기를 실어 보내면 그대로 새어든다. 이 자리가 정본 밖 확장을
 * 막는 벽은 아니라는 뜻이다 (Task 10 재리뷰 Minor — 이전 버전은 "호출자는 닿을 방법이
 * 없다" 고 적었는데, 실제로는 닿는다).
 *
 * 정본에는 없는 `aria-current="page"` 가 아코디언 자식에도 붙는다 — 패키지가
 * API 모양으로 더하는 접근성 확장이고(NavItem 문서 참고), 이 마지막 커밋 이전부터
 * 있던 동작이다.
 *
 * `itemClass` 와 달리 여기에는 `focus-visible:*` 링이 **없다. 의도한 것이다** —
 * `itemClass` 가 링을 다는 이유는 그쪽이 `focus-visible:outline-none` 으로 브라우저
 * 기본 포커스 표시를 끄기 때문이다. 이 자식 행은 `outline-none` 을 쓰지 않으므로
 * UA 기본 아웃라인이 그대로 남아 포커스가 보이지 않는 구간이 생기지 않는다. 링을
 * 더하면 문자열이 정본에서 한 줄 더 멀어지는데, 그 대가로 얻는 접근성이 없다.
 */
function childItemClass(active: boolean, className?: string) {
  return cn(
    "flex w-full items-center gap-2 rounded-[6px] px-[10px] py-[6px] text-[13px] transition-colors",
    active
      ? "font-semibold"
      : "text-default hover:bg-[var(--opacity-gray-50)] dark:hover:bg-[var(--opacity-white-50)]",
    className,
  );
}

export interface NavEntry extends Omit<NavItemProps, "renderLink" | "activeColor"> {
  key: string;
  children?: NavEntry[];
  defaultOpen?: boolean;
  /**
   * 자식이 있어도 부모 행을 `href` 링크로 그리고, 펼침은 옆의 캐럿 버튼이 맡는다.
   * 부모가 자기 화면을 가진 메뉴(프로젝트 > SI·자사)용이다. 끄면(기본) 정본대로 행 전체가
   * 아코디언 버튼 하나다 — `href` 가 있어도 쓰지 않는다. `href` 가 없으면 이 값은 무시한다.
   */
  parentLink?: boolean;
  /** `parentLink` 의 캐럿 버튼 접근성 이름. 기본은 `{label} 하위 메뉴`. */
  toggleLabel?: string;
  /**
   * 자식이 활성이 되는 순간 펼친다 — 딥링크로 들어오거나 경로가 바뀐 경우.
   * 활성인 동안 사용자가 접으면 접힌 채로 둔다. 다음에 다른 자식 없이 활성이 풀렸다
   * 다시 활성이 될 때 또 펼친다. `defaultOpen` 은 첫 렌더만 보므로 이 일을 못 한다.
   */
  expandWhenActive?: boolean;
  /**
   * 자식을 경로로 보여 주는 메뉴(프로젝트 > SI·자사). 값을 주면 아코디언이 아니다 — 부모는
   * `href` 링크이고, 펼침 버튼이 없으며, 자식은 이 값이 true 일 때만 보인다. 사용자가 접을 수
   * 없다. 자식은 점과 함께 그리고, 활성 자식은 연한 primary 배경을 쓴다.
   */
  showChildren?: boolean;
}

export interface NavSection {
  key: string;
  /** 있으면 섹션 제목으로 그려지고 그 그룹의 접근성 이름이 된다. */
  label?: string;
  items: NavEntry[];
}

export interface NavListProps {
  sections: NavSection[];
  renderLink?: NavLinkRenderer;
  activeColor?: string;
  "aria-label"?: string;
  className?: string;
}

/** NavEntry 에서 NavItem 이 모르는 필드를 떼어낸다. */
function toItemProps(entry: NavEntry): NavItemProps {
  const {
    key: _key,
    children: _children,
    defaultOpen: _defaultOpen,
    parentLink: _parentLink,
    toggleLabel: _toggleLabel,
    expandWhenActive: _expandWhenActive,
    showChildren: _showChildren,
    ...item
  } = entry;
  return item;
}

/** `showChildren` 자식 행 — 들여쓴 점 + 라벨, 활성이면 연한 primary 배경. */
function dotChildClass(active: boolean, className?: string) {
  return cn(
    "flex min-h-[30px] w-full items-center gap-[10px] rounded-[8px] pr-[12px] pl-[28px] text-[14px] transition-colors",
    active
      ? "bg-primary-soft font-bold"
      : "text-secondary hover:bg-[var(--opacity-gray-50)] dark:hover:bg-[var(--opacity-white-50)]",
    className,
  );
}

function RouteChildren({
  entry,
  renderLink,
  activeColor,
}: {
  entry: NavEntry;
  renderLink?: NavLinkRenderer;
  activeColor?: string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-[2px]">
      <NavItem {...toItemProps(entry)} renderLink={renderLink} activeColor={activeColor} />
      {entry.showChildren && entry.children ? (
        <div className="flex flex-col gap-[2px]">
          {entry.children.map((child) => (
            <Fragment key={child.key}>
              {renderNavItem(
                {
                  ...toItemProps(child),
                  label: (
                    <>
                      <span
                        data-nav-dot=""
                        aria-hidden="true"
                        className="h-[5px] w-[5px] shrink-0 rounded-full bg-current opacity-60"
                      />
                      {child.label}
                    </>
                  ),
                  renderLink,
                  activeColor,
                },
                dotChildClass,
                true,
              )}
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * children 을 가진 항목 하나. axhub-frontend InnerSidebar 의 renderItem
 * (children 분기, InnerSidebar.tsx:213-248)을 그대로 승격한 것 — 아이콘+라벨+뱃지+
 * CaretRight 를 가진 **버튼 하나**가 클릭 시 onSelect(내비게이션은 소비 앱 책임)와
 * 아코디언 토글을 함께 한다. `aria-expanded` 는 AxHub 에는 없는, 패키지가 더하는
 * 의도적 접근성 추가다.
 *
 * `onSelect` 는 "열리는 전환에서만" 호출된다 — AxHub InnerSidebar.tsx:217-220 과
 * 동일하게, 닫혀 있던 항목을 여는 클릭에서만 한 번 불린다. 이미 열린 항목을 닫는
 * 클릭에서는 호출되지 않는다. 소비 앱이 onSelect 를 "첫 자식으로 navigate" 로
 * 구현했을 때, 접는 클릭에서 재-navigate 되는 것을 막기 위함이다.
 */
function Accordion({
  entry,
  renderLink,
  activeColor,
}: {
  entry: NavEntry;
  renderLink?: NavLinkRenderer;
  activeColor?: string;
}): ReactElement {
  const childActive =
    (entry.expandWhenActive ?? false) && (entry.children ?? []).some((child) => child.active);
  const [open, setOpen] = useState((entry.defaultOpen ?? false) || childActive);
  // 렌더 중 상태 조정 — effect 를 쓰면 접힌 프레임이 한 번 그려진다.
  const [wasChildActive, setWasChildActive] = useState(childActive);
  if (childActive !== wasChildActive) {
    setWasChildActive(childActive);
    if (childActive) {
      setOpen(true);
    }
  }
  const IconComponent = entry.icon;
  const active = entry.active ?? false;
  const style: CSSProperties | undefined = active
    ? { color: activeColor ?? "var(--primary)" }
    : undefined;

  const caretClass = cn(
    "h-3.5 w-3.5 shrink-0 opacity-40 transition-transform duration-200",
    open && "rotate-90",
  );
  const linkedParent = entry.parentLink && entry.href;

  return (
    <div>
      {linkedParent ? (
        <div className="flex items-center gap-[2px]">
          <div className="min-w-0 flex-1">
            {renderNavItem({ ...toItemProps(entry), renderLink, activeColor }, itemClass)}
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-label={
              entry.toggleLabel ??
              (typeof entry.label === "string" ? `${entry.label} 하위 메뉴` : "하위 메뉴")
            }
            onClick={() => setOpen((v) => !v)}
            className="focus-visible:ring-focus focus-visible:ring-offset-background flex h-[32px] w-[28px] shrink-0 items-center justify-center rounded-[8px] transition-colors hover:bg-[var(--opacity-gray-50)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:bg-[var(--opacity-white-50)]"
          >
            <CaretRight
              aria-hidden="true"
              weight={active ? "fill" : "regular"}
              className={caretClass}
            />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => {
            if (!open) {
              entry.onSelect?.();
            }
            setOpen((v) => !v);
          }}
          className={itemClass(active, entry.className)}
          style={style}
          onMouseEnter={entry.onMouseEnter}
          onFocus={entry.onFocus}
          {...entry.dataAttrs}
        >
          {IconComponent ? (
            <IconComponent
              aria-hidden="true"
              weight={entry.iconWeight}
              className="h-[18px] w-[18px] shrink-0"
              style={active ? undefined : { color: "var(--icon-inactive)" }}
            />
          ) : null}
          {/* 정본 아코디언 트리거의 라벨 span (InnerSidebar.tsx:236) — `min-w-0` 은 없다. */}
          <span className="flex-1 truncate text-left">{entry.label}</span>
          {entry.badge}
          <CaretRight
            aria-hidden="true"
            weight={active ? "fill" : "regular"}
            className={caretClass}
          />
        </button>
      )}
      {open && entry.children ? (
        <div className="my-px flex flex-col pl-[16px]">
          <div className="pl-2">
            {entry.children.map((child) => (
              <Fragment key={child.key}>
                {renderNavItem(
                  { ...toItemProps(child), renderLink, activeColor },
                  childItemClass,
                  // 정본은 라벨을 span 으로 감싸지 않는다(InnerSidebar.tsx:269) —
                  // bareLabel 이 없으면 `truncate` 가 긴 라벨을 한 줄로 자른다.
                  true,
                )}
              </Fragment>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * 섹션으로 나뉜 내비게이션 목록.
 *
 * 권한 게이팅·뱃지 카운트는 여기서 하지 않는다 — 소비 앱이 이미 걸러낸 목록을 준다.
 * 그래야 패키지가 앱의 API 훅에 의존하지 않고, 두 앱이 같은 목록 컴포넌트를 쓸 수 있다.
 *
 * 항목 간 간격은 axhub-frontend InnerSidebar 의 mainSections 블록(InnerSidebar.tsx:356-369)을
 * 그대로 따른다 — 섹션 라벨과 항목이 모두 같은 flex 컬럼 안에서 균일한 gap-[8px] 로 쌓인다
 * (섹션 사이에서만 더 벌어지는 2단 간격 모델이 아니다). 라벨이 있는 섹션은 `role="group"` +
 * `className="contents"` 로 접근성 그룹핑만 하고 레이아웃에는 개입하지 않는다.
 */
export function NavList({
  sections,
  renderLink,
  activeColor,
  className,
  ...rest
}: NavListProps): ReactElement {
  return (
    <nav aria-label={rest["aria-label"]} className={cn("flex flex-col gap-[8px]", className)}>
      {sections.map((section) => {
        const items: ReactNode = section.items.map((entry) =>
          entry.showChildren !== undefined ? (
            <RouteChildren
              key={entry.key}
              entry={entry}
              renderLink={renderLink}
              activeColor={activeColor}
            />
          ) : entry.children && entry.children.length > 0 ? (
            <Accordion
              key={entry.key}
              entry={entry}
              renderLink={renderLink}
              activeColor={activeColor}
            />
          ) : (
            <NavItem
              key={entry.key}
              {...toItemProps(entry)}
              renderLink={renderLink}
              activeColor={activeColor}
            />
          ),
        );

        if (!section.label) {
          return <Fragment key={section.key}>{items}</Fragment>;
        }
        return (
          <div
            key={section.key}
            role="group"
            aria-labelledby={`nav-sec-${section.key}`}
            className="contents"
          >
            {/* 정본(axhub-frontend InnerSidebar.tsx:361, commit bc1e87cf)은 <div> 다.
                한때 <p> 로 승격돼 있었는데, 클래스는 같아도 태그가 다르면 정본 승격이
                아니다. id 는 위 role="group" 의 aria-labelledby 대상이라 유지한다. */}
            <div
              id={`nav-sec-${section.key}`}
              className="text-muted px-3 pt-4 text-[12px] font-medium tracking-[-0.12px]"
            >
              {section.label}
            </div>
            {items}
          </div>
        );
      })}
    </nav>
  );
}
