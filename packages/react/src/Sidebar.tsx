import type { ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

export interface SidebarProps {
  /** 상단 고정 영역 — 브랜드/워크스페이스 전환. */
  header?: ReactNode;
  /** 하단 고정 영역 — 계정/테마 토글. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  /**
   * 스크롤 영역(nav 내용)에 붙는 className. AxHub 는 이 영역에 자기만의
   * `sidebar-scroll`(hover 시 드러나는 얇은 스크롤바, globals.css 정의)을 얹는다 —
   * 그 클래스는 AxHub 전용이라 패키지로 올라오지 않으므로, 스왑 시 이 자리로
   * 전달해야 한다.
   */
  contentClassName?: string;
}

/**
 * 사이드바 컨테이너. 폭·배경·스크롤 경계만 소유하고 내용은 슬롯이다.
 *
 * `<nav>` 를 여기서 그리지 않는 이유: 한 사이드바에 내비 목록이 둘 이상일 수
 * 있고(주 메뉴 + 관리 메뉴), 랜드마크 이름은 NavList 가 각각 갖는 게 맞다.
 *
 * `lg` 미만에서는 기본적으로 숨는다 — AxHub 는 모바일에서 별도 드로어를 쓰고
 * 사이드바 컬럼 자체를 `hidden lg:flex lg:flex-col` 로 감춘다
 * (axhub-frontend AppLayout.tsx:134). 항상 보이길 원하는 소비자는 `className`
 * 으로 override 한다(`cn` 이 나중에 온 클래스를 병합해 이긴다).
 */
export function Sidebar({
  header,
  footer,
  children,
  className,
  contentClassName,
}: SidebarProps): ReactElement {
  return (
    <div
      className={cn(
        "bg-surface border-default hidden h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r lg:flex lg:flex-col",
        className,
      )}
    >
      {header ? <div className="shrink-0">{header}</div> : null}
      <div className={cn("min-h-0 flex-1 overflow-y-auto px-[8px] py-[12px]", contentClassName)}>
        {children}
      </div>
      {footer ? <div className="shrink-0">{footer}</div> : null}
    </div>
  );
}
