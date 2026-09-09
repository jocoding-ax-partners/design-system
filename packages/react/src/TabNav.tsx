import type { NavLinkRenderer } from "./NavItem.js";
import type { ReactElement, ReactNode } from "react";

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
          return (
            <span key={tab.key}>
              {renderLink({
                href: tab.to,
                className: cn(
                  "flex shrink-0 items-center gap-1.5 border-b-2 border-transparent px-2.5 py-2 text-sm leading-[1.5] transition-colors sm:px-4",
                  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  active ? "text-default font-semibold" : "text-muted hover:text-default",
                ),
                style: active ? { borderColor: activeColor ?? "var(--primary)" } : undefined,
                "aria-current": active ? "page" : undefined,
                children: (
                  <>
                    {tab.label}
                    {tab.badge}
                  </>
                ),
              })}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
