import { CaretDown } from "@phosphor-icons/react";
import { useState, type ReactElement, type ReactNode } from "react";

import { cn } from "./lib/cn.js";
import { NavItem, type NavItemProps, type NavLinkRenderer } from "./NavItem.js";

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
  const labelText = typeof entry.label === "string" ? entry.label : "";

  return (
    <li>
      <div className="flex items-center gap-[4px]">
        <NavItem {...toItemProps(entry)} renderLink={renderLink} activeColor={activeColor} />
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${labelText} 하위 메뉴 ${open ? "닫기" : "열기"}`}
          onClick={() => setOpen((v) => !v)}
          className="text-muted hover:bg-emphasis flex h-[32px] w-[24px] shrink-0 items-center justify-center rounded-[6px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <CaretDown
            aria-hidden="true"
            size={14}
            className={cn("transition-transform", open && "rotate-180")}
          />
        </button>
      </div>
      {open && entry.children ? (
        <ul className="mt-[2px] flex flex-col gap-[2px] pl-[20px]">
          {entry.children.map((child) => (
            <li key={child.key}>
              <NavItem {...toItemProps(child)} renderLink={renderLink} activeColor={activeColor} />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * 섹션으로 나뉜 내비게이션 목록.
 *
 * 권한 게이팅·뱃지 카운트는 여기서 하지 않는다 — 소비 앱이 이미 걸러낸 목록을 준다.
 * 그래야 패키지가 앱의 API 훅에 의존하지 않고, 두 앱이 같은 목록 컴포넌트를 쓸 수 있다.
 */
export function NavList({
  sections,
  renderLink,
  activeColor,
  className,
  ...rest
}: NavListProps): ReactElement {
  return (
    <nav aria-label={rest["aria-label"]} className={cn("flex flex-col gap-[16px]", className)}>
      {sections.map((section) => {
        const body: ReactNode = (
          <ul className="flex flex-col gap-[2px]">
            {section.items.map((entry) =>
              entry.children && entry.children.length > 0 ? (
                <Accordion
                  key={entry.key}
                  entry={entry}
                  renderLink={renderLink}
                  activeColor={activeColor}
                />
              ) : (
                <li key={entry.key}>
                  <NavItem
                    {...toItemProps(entry)}
                    renderLink={renderLink}
                    activeColor={activeColor}
                  />
                </li>
              ),
            )}
          </ul>
        );

        if (!section.label) {
          return <div key={section.key}>{body}</div>;
        }
        return (
          <div key={section.key} role="group" aria-labelledby={`nav-sec-${section.key}`}>
            <p
              id={`nav-sec-${section.key}`}
              className="text-subtle mb-[6px] px-[12px] text-[12px] font-semibold"
            >
              {section.label}
            </p>
            {body}
          </div>
        );
      })}
    </nav>
  );
}
