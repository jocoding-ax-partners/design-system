import type { NavLinkRenderer } from "./NavItem.js";
import type { ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

export interface AdminAppSwitchItem {
  key: string;
  href: string;
  label: ReactNode;
  active?: boolean;
}

export interface AdminAppSwitchProps {
  items: AdminAppSwitchItem[];
  "aria-label": string;
  renderLink?: NavLinkRenderer;
  className?: string;
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/**
 * 같은 주소에 있는 운영 앱 사이의 전환(AXLMS / APTA). 앱이 다르므로 기본 링크는 문서째 넘어가는 `<a>` 다.
 * 모양은 관리자 화면의 세그먼트(admin.axhub.ai 「B2B 기업 / B2C 개인」)와 같다.
 */
export function AdminAppSwitch({
  items,
  renderLink = DEFAULT_LINK,
  className,
  ...rest
}: AdminAppSwitchProps): ReactElement {
  return (
    <nav
      aria-label={rest["aria-label"]}
      className={cn(
        "flex w-fit items-center gap-0.5 rounded-[10px] bg-[var(--opacity-gray-50)] p-0.5 dark:bg-[var(--opacity-white-50)]",
        className,
      )}
    >
      {items.map((item) => (
        <span key={item.key} className="contents">
          {renderLink({
            href: item.href,
            "aria-current": item.active ? "page" : undefined,
            className: cn(
              "flex h-8 items-center rounded-[8px] px-3 text-[13px] whitespace-nowrap transition-colors",
              item.active
                ? "bg-content text-default font-semibold shadow-sm"
                : "text-muted hover:text-default",
            ),
            children: item.label,
          })}
        </span>
      ))}
    </nav>
  );
}
