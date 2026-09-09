import type { CSSProperties, ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

export interface TopBarProps {
  /** 사이드바와 세로로 정렬되는 좌측 고정 영역. AxHub 는 테넌트 전환기를 여기 둔다. */
  rail?: ReactNode;
  /** 좌측 본문 — 경로/제목. */
  leading?: ReactNode;
  /** 우측 본문 — 액션 버튼·유틸리티. */
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 상단 크롬 바. 정본은 axhub-frontend `layout/Topbar.tsx`.
 *
 * 색은 정본 시맨틱 토큰(bg-content / border-default)을 쓴다 — AxHub 원본은
 * `bg-background` / `border-border` 를 썼는데 그 두 이름은 디자인 시스템에도
 * AxHub globals.css 에도 정의가 없다(2026-09-09 실측). 승격하면서 정본 이름으로
 * 바꾸고, 계산된 색이 같은지는 소비 측 Task 8 에서 잰다.
 */
export function TopBar({ rail, leading, actions, className, style }: TopBarProps): ReactElement {
  return (
    <header
      className={cn(
        "bg-content border-default relative z-20 flex h-[var(--topbar-height)] shrink-0 items-center border-b",
        className,
      )}
      style={style}
    >
      {rail ? (
        <div className="hidden w-[var(--sidebar-width)] shrink-0 lg:block">{rail}</div>
      ) : null}
      <div className="flex min-w-0 flex-1 items-center gap-4 px-5">
        <div className="flex min-w-0 items-center gap-2 lg:gap-4">{leading}</div>
        {actions ? <div className="ml-auto flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
