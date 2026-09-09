import { CaretRight } from "@phosphor-icons/react";
import { useState, Fragment, type CSSProperties, type ReactElement, type ReactNode } from "react";

import { cn } from "./lib/cn.js";
import { itemClass, NavItem, type NavItemProps, type NavLinkRenderer } from "./NavItem.js";

export interface NavEntry extends Omit<NavItemProps, "renderLink" | "activeColor"> {
  key: string;
  children?: NavEntry[];
  defaultOpen?: boolean;
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
  const { key: _key, children: _children, defaultOpen: _defaultOpen, ...item } = entry;
  return item;
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
  const [open, setOpen] = useState(entry.defaultOpen ?? false);
  const IconComponent = entry.icon;
  const active = entry.active ?? false;
  const style: CSSProperties | undefined = active
    ? { color: activeColor ?? "var(--primary)" }
    : undefined;

  return (
    <div>
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
          className={cn(
            "h-3.5 w-3.5 shrink-0 opacity-40 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      </button>
      {open && entry.children ? (
        <div className="my-px flex flex-col pl-[16px]">
          <div className="pl-2">
            {entry.children.map((child) => (
              <NavItem
                key={child.key}
                {...toItemProps(child)}
                renderLink={renderLink}
                activeColor={activeColor}
              />
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
          entry.children && entry.children.length > 0 ? (
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
            <p
              id={`nav-sec-${section.key}`}
              className="text-muted px-3 pt-4 text-[12px] font-medium tracking-[-0.12px]"
            >
              {section.label}
            </p>
            {items}
          </div>
        );
      })}
    </nav>
  );
}
