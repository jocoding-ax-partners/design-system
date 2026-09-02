import { useCallback, useRef, useState, type ReactNode } from "react";

export interface ReadoutSpot {
  /** 컨테이너 기준 좌표(px). 툴팁은 이 지점 위쪽 가운데에 뜬다. */
  x: number;
  y: number;
  title: string;
  value: string;
}

/**
 * 차트 마크(캘린더 칸·막대) 위에 뜨는 가벼운 호버 툴팁.
 *
 * 브라우저 기본 `title` 은 뜨는 데 1초쯤 걸리고 OS 스타일이라 차트에 못 쓴다.
 * 마크가 수백 개라 Radix Tooltip 을 개당 붙이는 대신, 컨테이너 하나에 좌표만 올려 그린다.
 *
 * `useHoverReadout()` 로 spot 상태를 받아 마크의 onMouseEnter 에서 `show(el, ...)` 를 부른다.
 */
export function HoverReadout({ spot }: { spot: ReadoutSpot | null }) {
  if (!spot) {
    return null;
  }
  return (
    <div
      className="border-default bg-surface pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md border px-3 py-2 text-xs whitespace-nowrap shadow-[var(--shadow-sm)]"
      style={{ left: spot.x, top: spot.y - 6 }}
    >
      <p className="mb-0.5 font-medium">{spot.title}</p>
      <p className="text-muted">{spot.value}</p>
    </div>
  );
}

/** 컨테이너 ref + spot 상태 + 마크에 붙일 show/hide 핸들러. */
export function useHoverReadout() {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<ReadoutSpot | null>(null);

  const show = useCallback((el: HTMLElement, title: string, value: string) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) {
      return;
    }
    const r = el.getBoundingClientRect();
    setSpot({ x: r.left - box.left + r.width / 2, y: r.top - box.top, title, value });
  }, []);
  const hide = useCallback(() => setSpot(null), []);

  return { ref, spot, show, hide };
}

/** 툴팁을 담는 relative 컨테이너 — `ref` 를 그대로 넘긴다. */
export function ReadoutSurface({
  surfaceRef,
  children,
  onMouseLeave,
}: {
  surfaceRef: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
  onMouseLeave: () => void;
}) {
  return (
    <div ref={surfaceRef} className="relative" onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
}
