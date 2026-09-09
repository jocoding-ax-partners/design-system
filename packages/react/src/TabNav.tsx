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
              // 여기는 이 패키지에서 **정본이 포커스 링을 이미 갖고 있는 유일한 곳**이다
              // (axhub-frontend tab-page/ui/TabNav.tsx:35):
              //   `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none`
              // 링 **색**을 정본이 주지 않으므로 여기도 주지 않는다 — Tailwind 기본값
              // `currentColor` 가 된다. `NavItem`·`PageHeader`·`Breadcrumbs` 는
              // `ring-focus`(= `var(--focus)`)를 쓰는데 여기만 안 쓰는 게 일부러다:
              // 저쪽은 정본에 링 자체가 없어 줄 전체가 패키지 창작이라 색도 패키지가
              // 정하지만, 여기는 정본이 이미 내린 결정이 있다. AxHub 가 지금 프로덕션에서
              // 그리는 표면을 사람 승인 없이 리팩 경로로 바꾸지 않는다.
              //
              // `ring-offset-background` 하나만 더한다. 정본이 오프셋 **색**은 안 정해서
              // Tailwind 기본값이 하드코딩 흰색이 되는데, 다크 표면에서 흰 후광으로 보였다
              // (79b3ee4 실측). 색을 안 정한 자리를 메우는 것이지 정본이 정한 값을
              // 바꾸는 게 아니다.
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
