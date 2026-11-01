import type { ElementType, ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

/**
 * 관리자 콘솔 흰 박스의 단일 출처. 정본은 axhub-frontend `layout/consoleCard.ts`
 * (DESIGN.md 6.2) — 캔버스(`bg-canvas`) 위에 서는 영역 카드: 반경 12 · 패딩 16 ·
 * 테두리 `border-default`. 화면마다 클래스를 따로 적으면 다시 어긋나므로 문자열을
 * 그대로 연다. 컴포넌트를 못 쓰는 자리(표 래퍼·`<section>` 에 직접 얹기)는 이 상수를 쓴다.
 *
 * HeroUI `Card` 를 감싸지 않는 이유: HeroUI 카드는 `--radius-card`(버튼 반경 계열)와
 * `Card.Content` 의 자체 패딩을 가져서, 정본의 12/16 과 갈린다.
 */
export const cardClass = "bg-content border-default rounded-xl border p-4";

/** 패딩 없는 흰 박스 — 목록·표처럼 행이 박스 가장자리까지 닿는 영역. */
export const cardFlushClass = "bg-content border-default overflow-hidden rounded-xl border";

/** 빈 상태(「~가 없습니다」) — 카드 안에 놓이므로 테두리 없이 여백만. */
export const cardEmptyClass = "rounded-xl px-4 py-10 text-center";

/** 콘솔 콘텐츠 바탕. 카드가 서는 바닥 — 앱 셸의 `<main>` 이 칠한다. */
export const canvasClass = "bg-canvas";

export interface CardProps {
  children: ReactNode;
  /** `md` 는 안쪽 16px, `none` 은 행이 가장자리까지 닿는 목록·표용. */
  padding?: "md" | "none";
  /** 렌더할 요소. 영역 제목이 있으면 `section` 을 권한다. */
  as?: ElementType;
  className?: string;
}

export function Card({
  children,
  padding = "md",
  as: Component = "div",
  className,
}: CardProps): ReactElement {
  return (
    <Component className={cn(padding === "none" ? cardFlushClass : cardClass, className)}>
      {children}
    </Component>
  );
}

export interface CardEmptyProps {
  children: ReactNode;
  className?: string;
}

/** 카드 안 빈 상태 문구. 글자색은 읽히는 보조색(`text-muted`). */
export function CardEmpty({ children, className }: CardEmptyProps): ReactElement {
  return <div className={cn(cardEmptyClass, "text-muted text-[14px]", className)}>{children}</div>;
}
