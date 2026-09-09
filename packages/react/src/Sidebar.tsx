import type { ReactElement, ReactNode } from "react";

import { cn } from "./lib/cn.js";

export interface SidebarProps {
  /** 상단 고정 영역 — 브랜드/워크스페이스 전환. */
  header?: ReactNode;
  /** 하단 고정 영역 — 계정/테마 토글. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  /**
   * 스크롤 영역(nav 내용)에 붙는 className. AxHub 는 이 영역에 자기만의
   * `sidebar-scroll`(hover 시 드러나는 얇은 스크롤바, globals.css 정의)을 얹는다 —
   * 그 클래스는 AxHub 전용이라 패키지로 올라오지 않으므로, 스왑 시 이 자리로
   * 전달해야 한다.
   */
  contentClassName?: string;
}

/**
 * 사이드바 컨테이너. 폭·배경·스크롤 경계만 소유하고 내용은 슬롯이다.
 *
 * `<nav>` 를 여기서 그리지 않는 이유: 한 사이드바에 내비 목록이 둘 이상일 수
 * 있고(주 메뉴 + 관리 메뉴), 랜드마크 이름은 NavList 가 각각 갖는 게 맞다.
 *
 * `lg` 미만에서는 기본적으로 숨는다 — AxHub 는 모바일에서 별도 드로어를 쓰고
 * 사이드바 컬럼 자체를 `hidden lg:flex lg:flex-col` 로 감춘다
 * (axhub-frontend AppLayout.tsx:134). 항상 보이길 원하는 소비자는 `className`
 * 으로 override 한다(`cn` 이 나중에 온 클래스를 병합해 이긴다).
 *
 * 색은 정본 클래스 문자열(`bg-background` / `border-border`) 그대로다 — 같은
 * AppLayout.tsx:134 줄이 폭·`hidden lg:flex` 와 함께 쓰는 값이다. 한때
 * `bg-surface border-default` 로 드리프트해 있었다. 두 유틸리티의 성격이 다르다:
 *
 * - **배경은 실제로 달랐다.** `bg-background` → `--background` 는 라이트 `#fff`,
 *   다크는 AxHub 가 `--surface`(= gray-900 `#16171b`)로 덮는다. `bg-surface` →
 *   `--bg-surface` 는 라이트 `var(--color-gray-50)`, 다크 `#25272d` 다. APTA 브라우저
 *   실측(10개 라우트·양 테마)에서도 사이드바만 `oklch(0.987 0.002 264.5)` / `rgb(37 39 45)`
 *   로 상단바(`rgb(255 255 255)` / `oklch(0.12 0.005 285.823)`)와 갈렸다. 사용자가 보는
 *   회귀였다.
 * - **보더는 렌더 결과가 같았다.** APTA 는 `apps/admin/src/styles/global.css:167` 에서
 *   `--border: var(--border-default)` 로 두 토큰을 같은 값에 묶는다. 그래서 브라우저
 *   실측에서 사이드바의 `border-right-color` 와 상단바의 `border-bottom-color` 가 라이트
 *   `oklch(0.928 0.006 264.531)` · 다크 `rgba(255, 255, 255, 0.1)` 로 정확히 일치했다.
 *   여기서 `border-default` → `border-border` 로 바꾸는 것은 **토큰 정체성 교정**이지
 *   시각 회귀 수정이 아니다 — 오늘 같은 값인 두 토큰이 내일 갈라질 수 있어서 정본이
 *   가리키는 토큰을 가리키게 하는 것뿐이다.
 *
 * 이 구분을 남기는 이유: 이 브랜치는 한 번 **JSDoc 에 적힌 거짓 근거** 때문에 색을
 * 정본에서 멀어지게 바꾼 적이 있다(`TopBar`, 663528e 에서 되돌림). 근거는 판정하려는
 * 층에서 잰 것만 적는다.
 *
 * `TopBar` 와 같은 전제: 이 두 유틸리티는 `@heroui/styles` 가 있어야 해석된다.
 * `--background`/`--border` 커스텀 프로퍼티는 design-system dist 가 정의하지만,
 * 그걸 `bg-background`/`border-border` 로 만드는 `@theme` 매핑
 * (`--color-background: var(--background)`)은 `@heroui/styles`
 * (`dist/themes/shared/theme.css`)에만 있다. 두 소비 앱 다 그 패키지를 import
 * 한다.
 *
 * `h-full` 과 base-level `flex-col` 은 정본에 없는 추가다 — 정본은 `hidden` 아래라
 * 무-op 이지만, 여기서는 `className="flex"` 로 `hidden` 을 걷어내는 소비자(APTA)가
 * 있어서 base 에도 방향이 있어야 컬럼으로 쌓인다.
 */
export function Sidebar({
  header,
  footer,
  children,
  className,
  contentClassName,
}: SidebarProps): ReactElement {
  return (
    <div
      className={cn(
        "bg-background border-border hidden h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r lg:flex lg:flex-col",
        className,
      )}
    >
      {header ? <div className="shrink-0">{header}</div> : null}
      <div className={cn("min-h-0 flex-1 overflow-y-auto px-[8px] py-[12px]", contentClassName)}>
        {children}
      </div>
      {footer ? <div className="shrink-0">{footer}</div> : null}
    </div>
  );
}
