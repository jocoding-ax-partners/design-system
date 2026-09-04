import { Pagination as HPagination } from "@heroui/react";

import { cn } from "./lib/cn";

interface PaginationProps {
  page: number;
  pageCount: number;
  siblingCount?: number;
  className?: string;
  /**
   * 전체 항목 수. 지정하면 번호형 nav 위에 "페이지 X / Y · 총 N건" 텍스트를 가진
   * 카드 레이아웃으로 감싸 렌더한다 (테이블 목록용 부가 정보). 미지정 시 기존처럼 nav 만 렌더.
   */
  total?: number;
  onChange: (page: number) => void;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function buildItems(
  page: number,
  pageCount: number,
  siblingCount: number,
): (number | "ellipsis")[] {
  // anchor = 끝단에 항상 보여줄 페이지 수 (기본 3)
  const anchor = siblingCount + 2;

  // ≤ anchor*2 (기본 6페이지) 이하면 모두 표시
  if (pageCount <= anchor * 2) {
    return range(1, pageCount);
  }

  const leftBound = page - siblingCount;
  const rightBound = page + siblingCount;
  const nearStart = leftBound <= anchor;
  const nearEnd = rightBound >= pageCount - anchor + 1;

  if (nearStart && nearEnd) {
    return range(1, pageCount);
  }

  if (nearStart) {
    const startEnd = Math.max(rightBound, anchor);
    return [...range(1, startEnd), "ellipsis", ...range(pageCount - anchor + 1, pageCount)];
  }

  if (nearEnd) {
    const endStart = Math.min(leftBound, pageCount - anchor + 1);
    return [...range(1, anchor), "ellipsis", ...range(endStart, pageCount)];
  }

  return [1, "ellipsis", ...range(leftBound, rightBound), "ellipsis", pageCount];
}

export function Pagination({
  page,
  pageCount,
  onChange,
  siblingCount = 1,
  className,
  total,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const items = buildItems(page, pageCount, siblingCount);

  const nav = (
    <HPagination className={total === undefined ? className : undefined} aria-label="페이지 이동">
      <HPagination.Content>
        <HPagination.Item>
          <HPagination.Previous
            aria-label="이전 페이지"
            isDisabled={page === 1}
            onPress={() => onChange(Math.max(1, page - 1))}
          >
            <HPagination.PreviousIcon />
          </HPagination.Previous>
        </HPagination.Item>
        {items.map((it, i) =>
          it === "ellipsis" ? (
            <HPagination.Item key={`e${i}`}>
              <HPagination.Ellipsis />
            </HPagination.Item>
          ) : (
            <HPagination.Item key={it}>
              <HPagination.Link isActive={it === page} onPress={() => onChange(it)}>
                {it}
              </HPagination.Link>
            </HPagination.Item>
          ),
        )}
        <HPagination.Item>
          <HPagination.Next
            aria-label="다음 페이지"
            isDisabled={page === pageCount}
            onPress={() => onChange(Math.min(pageCount, page + 1))}
          >
            <HPagination.NextIcon />
          </HPagination.Next>
        </HPagination.Item>
      </HPagination.Content>
    </HPagination>
  );

  if (total === undefined) {
    return nav;
  }

  return (
    <div
      className={cn(
        "border-default bg-content mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm",
        className,
      )}
    >
      <p className="text-muted">
        페이지 <span className="text-default font-semibold">{page}</span>
        {" / "}
        <span className="text-default font-semibold">{pageCount}</span>
        <span className="text-muted ml-3 text-xs">총 {total.toLocaleString()}건</span>
      </p>
      {nav}
    </div>
  );
}
