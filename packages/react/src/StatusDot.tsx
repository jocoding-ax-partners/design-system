import type { CSSProperties, ReactNode } from "react";

import { cn } from "./lib/cn.js";

export type StatusDotTone = "active" | "warning" | "failed" | "muted";

// 구 dac 팔레트 `.status` 의 텍스트 색 — 기본(무톤)/active/warning/failed 는 모두 --c-text-sub
// (→ globals --fg-muted), muted 톤만 --c-text-faint(→ --fg-disabled) 로 더 옅다.
const TEXT_CLASS: Record<StatusDotTone | "default", string> = {
  default: "text-muted",
  active: "text-muted",
  warning: "text-muted",
  failed: "text-muted",
  muted: "text-disabled",
};

// dot 색 — active=success/warning=warning/failed=danger(모두 *-strong, 라이트·다크 둘 다
// 정의돼 있는 유일한 success/warning/danger 변형), 기본·muted 는 중립 회색(--fg-disabled).
const DOT_CLASS: Record<StatusDotTone | "default", string> = {
  default: "bg-[var(--fg-disabled)]",
  active: "bg-success-strong",
  warning: "bg-warning-strong",
  failed: "bg-danger-strong",
  muted: "bg-[var(--fg-disabled)]",
};

interface StatusDotProps {
  /** active(성공)/warning(경고)/failed(실패)/muted(비활성, 더 옅은 회색) — 생략 시 기본 톤. */
  tone?: StatusDotTone;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 구 dac 팔레트 `.status`(dot + uppercase 소문자 라벨) 를 Tailwind + globals 토큰으로 재현한 것.
 * HeroUI `Chip` 은 배경이 깔린 알약(pill) 룩이라 이 자리에 못 쓴다(대체 시도했다가
 * "dot+텍스트" 형태가 "배경 pill" 로 바뀌어 회귀 지적을 받았다).
 *
 * dot 은 `::before` 대신 실제 `<span aria-hidden>` 으로 그린다 — 상태 텍스트가 이미
 * 접근성 이름을 제공하므로(예: "승인", "심사대기") dot 은 순수 장식이고, 스크린리더가
 * 색만 있는 dot 을 별도로 읽어줄 필요가 없다(오히려 중복 노출을 피한다).
 */
export function StatusDot({ tone, children, className, style }: StatusDotProps) {
  const key = tone ?? "default";
  return (
    <span
      className={cn(
        // `leading-normal` 은 필수다 — ag-grid 는 셀에 rowHeight 기반 line-height(40px 행에서
        // 35px, 56px 행에서 37px)를 걸고, 이 span 이 그걸 상속하면 박스가 내용의 2배로
        // 부푼다(실측: 표 밖 18px vs 셀 안 35~37px). 명시해야 표 안팎 높이가 같아진다.
        "inline-flex items-center gap-2 text-[12px] leading-normal font-medium tracking-[0.04em] uppercase",
        TEXT_CLASS[key],
        className,
      )}
      style={style}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT_CLASS[key])}
      />
      {children}
    </span>
  );
}
