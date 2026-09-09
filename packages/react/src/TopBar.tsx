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
 * `bg-background` / `border-border` 를 썼는데, `--border` 는 AxHub globals.css
 * 어디에도 정의가 없고 `--background` 는 `[data-theme='dark']` 안에서만 정의돼
 * 라이트 테마(bare `:root`)에는 정의가 없다(2026-09-09 실측). 승격하면서 정본
 * 이름으로 바꾸고, 계산된 색이 같은지는 소비 측 Task 8 에서 잰다.
 */
export function TopBar({ rail, leading, actions, className, style }: TopBarProps): ReactElement {
  return (
    // lg:border-b: 모바일엔 헤더 아래 사이드바가 없어 경계선이 떠 있는 줄처럼 보인다
    // (axhub-frontend Topbar.tsx:16-18).
    <header
      className={cn(
        "bg-content border-default relative z-20 flex h-[var(--topbar-height)] shrink-0 items-center lg:border-b",
        className,
      )}
      style={style}
    >
      {rail ? (
        <div className="hidden w-[var(--sidebar-width)] shrink-0 lg:block">{rail}</div>
      ) : null}
      {/*
        안쪽 행은 정본(axhub-frontend Topbar.tsx:27-47)의 클래스 문자열 그대로다 —
        `justify-between` 으로 양끝 정렬하고, 어느 쪽 래퍼에도 `min-w-0`·`ml-auto` 를
        붙이지 않는다. 한때 이 자리가 `gap-4` + leading 에 `min-w-0` + actions 에
        `ml-auto` 로 갈라져 있었는데, 그러면 좁은 화면에서 leading 이 0까지 줄어들고
        `shrink-0` 인 햄버거가 래퍼 밖으로 삐져나와 유틸리티 묶음 밑에 깔린다. 묶음이
        DOM 상 뒤라 클릭까지 가져간다. 유틸리티 묶음 290.4px(Tutorial·Docs 알약 +
        size-9 셋, gap-3)로 잰 겹침(2026-09-09 실측):

          폭     정본   min-w-0/ml-auto 판
          320px   0px    16px  (36px 버튼 중)
          360px   0px    2.38px
          375px   0px    0px
          414px   0px    0px

        정본은 같은 압력을 겹침이 아니라 오른쪽 오버플로(320px 에서 22.38px)로 흘려
        햄버거를 끝까지 누를 수 있게 남긴다.
      */}
      <div className="flex min-w-0 flex-1 items-center justify-between px-5">
        <div className="flex items-center gap-2 lg:gap-4">{leading}</div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
    </header>
  );
}
