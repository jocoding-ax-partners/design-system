import type { NavLinkRenderer, NavLinkRenderProps } from "./NavItem.js";

import { Chip } from "@heroui/react";
import { cloneElement, type ReactElement, type ReactNode } from "react";

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
          const linkProps: NavLinkRenderProps = {
            href: tab.to,
            className: cn(
              "flex shrink-0 items-center gap-1.5 border-b-2 border-transparent px-2.5 py-2 text-sm leading-[1.5] transition-colors sm:px-4",
              "focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
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
          // key 는 cloneElement 로 링크 자신에게 단다 — <span> 으로 감싸면 그 span 이
          // flex 아이템이 되고, shrink-0 은 안쪽 <a> 에 있어 효력을 잃는다. 좁은 화면에서
          // 탭이 가로 스크롤되지 않고 찌그러진다(2026-09-09 실측, 320px·탭 7개:
          // 감싼 쪽은 탭 폭이 전부 44.1px 로 눌리고 라벨이 3줄로 접혀 탭바 높이 54→117px).
          return cloneElement(renderLink(linkProps), { key: tab.key });
        })}
      </nav>
    </div>
  );
}
