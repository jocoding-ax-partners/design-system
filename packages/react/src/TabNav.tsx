import type { NavLinkRenderer, NavLinkRenderProps } from "./NavItem.js";
import type { ReactElement, ReactNode } from "react";

import { Chip } from "@heroui/react";

import { cn } from "./lib/cn.js";

export interface TabNavTab {
  key: string;
  to: string;
  label: ReactNode;
  badge?: ReactNode;
  /** 라우터 매칭용 힌트. 패키지는 쓰지 않고 소비 앱의 renderLink 가 읽는다. */
  end?: boolean;
}

export interface TabNavProps {
  tabs: TabNavTab[];
  activeKey?: string;
  activeColor?: string;
  renderLink?: NavLinkRenderer;
  className?: string;
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/**
 * 밑줄 탭. 정본은 axhub-frontend `tab-page/ui/TabNav.tsx`.
 *
 * 활성 판정은 소비 앱이 한다(activeKey) — 패키지가 라우터를 모르기 때문이다.
 */
export function TabNav({
  tabs,
  activeKey,
  activeColor,
  renderLink = DEFAULT_LINK,
  className,
}: TabNavProps): ReactElement {
  return (
    <div className={cn("border-divider border-b", className)}>
      <nav
        role="tablist"
        aria-orientation="horizontal"
        className="-mb-px flex w-full max-w-full min-w-0 items-start gap-1 overflow-x-auto px-2"
      >
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          // NavLinkRenderProps 는 NavItem/Breadcrumbs 와 공유하는 타입이라 role/aria-selected
          // 가 없다. TabNav 만 필요한 ARIA 속성이라 여기서 로컬 확장한다 — 실제 <a> 로는
          // DEFAULT_LINK({ ...props }) 스프레드를 타고 그대로 전달된다.
          const linkProps: NavLinkRenderProps & { role: "tab"; "aria-selected": boolean } = {
            href: tab.to,
            className: cn(
              "flex shrink-0 items-center gap-1.5 border-b-2 border-transparent px-2.5 py-2 text-sm leading-[1.5] transition-colors sm:px-4",
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              active
                ? "text-default font-semibold"
                : "text-default/90 hover:text-default border-transparent font-normal",
            ),
            style: active ? { borderColor: activeColor ?? "var(--primary)" } : undefined,
            "aria-current": active ? "page" : undefined,
            role: "tab",
            "aria-selected": active,
            children: (
              <>
                {tab.label}
                {tab.badge ? (
                  <Chip size="sm" variant="soft" color={active ? "accent" : "default"}>
                    {tab.badge}
                  </Chip>
                ) : null}
              </>
            ),
          };
          return <span key={tab.key}>{renderLink(linkProps)}</span>;
        })}
      </nav>
    </div>
  );
}
