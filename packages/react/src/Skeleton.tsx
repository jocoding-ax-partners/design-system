import { Skeleton } from "@heroui/react";

/** SkeletonRow — table 한 행 padding 안 자연스럽게 채우는 헬퍼 (table 밖 flex layout 용) */
export function SkeletonRow({
  widths = [120, 80, 200, 40],
  className,
}: {
  widths?: Array<number | string>;
  className?: string;
}) {
  return (
    <div className={["flex items-center gap-3 px-4 py-2.5", className].filter(Boolean).join(" ")}>
      {/* width 는 호출부가 넘기는 런타임 값이라 style 로만 표현된다. 고정 높이는 클래스. */}
      {widths.map((w, i) => (
        <Skeleton key={i} className="h-3.5" style={{ width: w }} />
      ))}
    </div>
  );
}
