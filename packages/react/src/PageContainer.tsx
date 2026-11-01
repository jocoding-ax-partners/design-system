import type { ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * 페이지 바깥 여백의 유일한 출처. 정본은 axhub-frontend `layout/PageContainer.tsx`.
 * 화면이 자기 padding 을 따로 두지 않게 하려고 존재한다.
 *
 * 폭 1600 · 모바일 위 여백 20 은 정본이 넓은 화면용으로 바꾼 값이다(한때 1280 · pt-10 으로
 * 갈라져 있었다).
 */
export function PageContainer({ children, className }: PageContainerProps): ReactElement {
  return (
    <div
      className={cn(
        "px-container mx-auto w-full max-w-[1600px] pt-5 pb-[120px] md:pt-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
