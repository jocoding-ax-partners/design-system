import type { ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

export interface SidebarProps {
  /** 상단 고정 영역 — 브랜드/워크스페이스 전환. */
  header?: ReactNode;
  /** 하단 고정 영역 — 계정/테마 토글. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * 사이드바 컨테이너. 폭·배경·스크롤 경계만 소유하고 내용은 슬롯이다.
 *
 * `<nav>` 를 여기서 그리지 않는 이유: 한 사이드바에 내비 목록이 둘 이상일 수
 * 있고(주 메뉴 + 관리 메뉴), 랜드마크 이름은 NavList 가 각각 갖는 게 맞다.
 */
export function Sidebar({ header, footer, children, className }: SidebarProps): ReactElement {
  return (
    <div
      className={cn(
        "bg-surface border-default flex h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r",
        className,
      )}
    >
      {header ? <div className="shrink-0">{header}</div> : null}
      <div className="min-h-0 flex-1 overflow-y-auto px-[12px] py-[16px]">{children}</div>
      {footer ? <div className="shrink-0">{footer}</div> : null}
    </div>
  );
}
