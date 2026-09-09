import type { NavLinkRenderer } from "./NavItem.js";

import { Fragment, type ReactElement, type ReactNode } from "react";

import { cn } from "./lib/cn.js";

export interface BreadcrumbEntry {
  key: string;
  label: ReactNode;
  /** 없으면(또는 마지막 항목이면) 현재 위치로 그려진다 — 링크가 아니다. */
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbEntry[];
  renderLink?: NavLinkRenderer;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/**
 * 상단 크롬의 위치 표시. APTA 가 손으로 그리던 `.breadcrumbs` BEM 을 대체한다.
 *
 * 마지막 항목은 href 가 있어도 링크로 만들지 않는다 — 현재 페이지로 가는 링크는
 * 스크린리더에서 목적 없는 이동으로 읽힌다.
 */
export function Breadcrumbs({
  items,
  renderLink = DEFAULT_LINK,
  className,
  ...rest
}: BreadcrumbsProps): ReactElement {
  return (
    <nav
      aria-label={rest["aria-label"] ?? "위치"}
      className={cn("flex min-w-0 items-center gap-[6px] text-[14px]", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={item.key}>
            {index > 0 ? (
              <span aria-hidden="true" className="text-subtle shrink-0">
                /
              </span>
            ) : null}
            {isLast || !item.href ? (
              <span
                aria-current={isLast ? "page" : undefined}
                className="text-default min-w-0 truncate font-semibold"
              >
                {item.label}
              </span>
            ) : (
              renderLink({
                href: item.href,
                className:
                  "text-muted hover:text-default min-w-0 shrink-0 truncate transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                children: item.label,
              })
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
