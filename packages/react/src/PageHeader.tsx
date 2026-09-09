import type { NavLinkRenderer } from "./NavItem.js";
import type { ReactElement, ReactNode } from "react";

import { ArrowLeft } from "@phosphor-icons/react";

import { cn } from "./lib/cn.js";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** 주면 제목 위에 뒤로 링크를 그린다. */
  backTo?: string;
  backLabel?: string;
  titleClassName?: string;
  center?: boolean;
  actions?: ReactNode;
  renderLink?: NavLinkRenderer;
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/** 정본은 axhub-frontend `shared/PageHeader.tsx`. 클래스 문자열을 바꾸지 않는다. */
export function PageHeader({
  title,
  description,
  backTo,
  backLabel = "뒤로",
  titleClassName,
  center = false,
  actions,
  renderLink = DEFAULT_LINK,
}: PageHeaderProps): ReactElement {
  return (
    <div className={cn("flex shrink-0 items-end gap-5", center && "justify-center text-center")}>
      <div className="min-w-0 flex-1">
        {backTo
          ? renderLink({
              href: backTo,
              className:
                "inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-default mb-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              children: (
                <>
                  <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                  {backLabel}
                </>
              ),
            })
          : null}
        <h1 className={cn("text-default text-[32px] font-bold", titleClassName)}>{title}</h1>
        {description ? <p className="text-muted mt-3 text-[18px]">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
