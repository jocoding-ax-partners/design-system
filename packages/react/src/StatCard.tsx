import type { ReactNode } from "react";

import { Card } from "@heroui/react";

/** 대시보드 요약 수치 카드 — 라벨(작게) + 값(굵게) + 보조설명.
 *  value 는 ReactNode 라 로딩 중 Skeleton 을 넣어 높이를 유지할 수 있다. */
export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Card>
      <Card.Content>
        <p className="text-subtle text-xs">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        {sub && <p className="text-muted mt-0.5 text-xs">{sub}</p>}
      </Card.Content>
    </Card>
  );
}
