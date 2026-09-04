import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "./lib/cn";

// AXHub 선택 가능한 리스트 (마스터-디테일 좌측 목록 등).
// 박스로 감싸지 않는 "열린" 리스트 — 항목 사이 divider 로만 구분해 페이지에 그대로 놓인다.
// 선택 항목은 primary-soft 로 강조 (테두리/ring 없이 → 패임·잡음 없음).

export function List({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("divide-y divide-[color:var(--border-divider)]", className)}>{children}</div>
  );
}

interface ListItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 선택 상태 — 좌측 primary 액센트 바 + 은은한 bg + aria-current. */
  selected?: boolean;
}

export const ListItem = forwardRef<HTMLButtonElement, ListItemProps>(function ListItem(
  { selected = false, className, children, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-current={selected || undefined}
      className={cn(
        // 선택은 좌측 primary 액센트 바가 주 신호 — bg 는 은은하게(gray-100).
        // outline-none: 클릭 포커스 시 UA 기본 테두리 제거, 키보드는 focus-visible 로 표시.
        "relative flex w-full items-center gap-3 px-3 py-3 text-left transition-colors outline-none",
        selected ? "bg-surface" : "hover:bg-surface focus-visible:bg-surface",
        className,
      )}
      {...rest}
    >
      {selected && (
        <span
          aria-hidden
          className="absolute top-1/2 left-0 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--primary)]"
        />
      )}
      {children}
    </button>
  );
});
