import type { ReactNode } from "react";

import { Card } from "@heroui/react";

export type StatCardTone = "default" | "accent" | "danger" | "success" | "warning";

// 상태색은 흰 면 위 글자이므로 AA 를 넘는 -strong 단계를 쓴다.
const TONE_CLASS: Record<StatCardTone, string> = {
  default: "",
  accent: "text-accent",
  danger: "text-danger-strong",
  success: "text-success-strong",
  warning: "text-warning-strong",
};

/** 대시보드 요약 수치 카드 — 라벨(작게) + 값(굵게) + 보조설명.
 *  value 는 ReactNode 라 로딩 중 Skeleton 을 넣어 높이를 유지할 수 있다.
 *  tone 은 지표별 강조색(위험 지표는 danger 등). */
export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: StatCardTone;
}) {
  return (
    <Card>
      <Card.Content>
        <p className="text-muted text-xs">{label}</p>
        <p className={`mt-1 text-2xl font-semibold tracking-tight ${TONE_CLASS[tone]}`.trimEnd()}>
          {value}
        </p>
        {sub && <p className="text-muted mt-0.5 text-xs">{sub}</p>}
      </Card.Content>
    </Card>
  );
}
