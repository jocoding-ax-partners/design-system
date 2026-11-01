import { List, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useState, type ReactElement, type ReactNode } from "react";

import { canvasClass } from "./Card.js";
import { cn } from "./lib/cn.js";
import { Sidebar } from "./Sidebar.js";
import { TopBar } from "./TopBar.js";

export interface AdminShellProps {
  /** 로고 묶음. 데스크톱은 GNB 왼쪽(사이드바 폭 칸), 모바일은 GNB 맨 앞에 선다. */
  brand: ReactNode;
  /** 사이드바 본문 — 보통 `<nav aria-label>` 안의 `NavList`·`NavItem`. 모바일 드로어도 같은 노드를 그린다. */
  nav: ReactNode;
  /** 사이드바 위 고정 영역 — 메뉴 검색 등. */
  sidebarHeader?: ReactNode;
  /** 사이드바 아래 고정 영역 — 계정·로그아웃·테마. */
  sidebarFooter?: ReactNode;
  /** GNB 왼쪽 본문(브랜드 칸 오른쪽) — 경로·워크스페이스 표시. */
  topbarLeading?: ReactNode;
  /** GNB 오른쪽 — 테마·알림·계정. */
  topbarActions?: ReactNode;
  /** 본문. 회색 캔버스(`bg-canvas`) 위에 놓인다. */
  children: ReactNode;
  className?: string;
  sidebarClassName?: string;
  mainClassName?: string;
  /**
   * GNB·사이드바·모바일 드로어가 함께 쓰는 면 클래스. 기본은 `bg-background`(라이트 흰색)인데,
   * 앱이 `bg-background` 를 페이지 회색에 묶어 둔 경우(admin.axhub.ai·APTA·AXLMS)
   * `bg-[var(--background)]`·`bg-[var(--surface)]` 처럼 흰 면을 직접 준다. 셋이 갈리지 않게 한 자리에서 받는다.
   */
  surfaceClassName?: string;
  /** 모바일 메뉴 버튼의 읽기용 이름. */
  menuLabel?: string;
  /**
   * 바뀌면 모바일 드로어를 닫는다 — 보통 현재 경로. 패키지가 라우터를 모르므로
   * 소비 앱이 준다(Next `usePathname()`, react-router `location.pathname`).
   */
  closeKey?: unknown;
}

/**
 * 관리자 화면 틀. 정본은 admin.axhub.ai(axhub-mono `frontend-admin` `AdminLayout.tsx`).
 *
 * ┌──────────────── GNB 60px (TopBar) ────────────────┐
 * │ [brand 244px]  [leading]                [actions] │
 * ├─────────────┬─────────────────────────────────────┤
 * │ Sidebar     │ main — bg-canvas, 흰 카드가 위에 선다 │
 * │ 244px       │                                     │
 * └─────────────┴─────────────────────────────────────┘
 *
 * 관리자 화면(플랫폼 어드민·콘솔 관리·AXLMS 백오피스·APTA 운영·axacademy 관리자)이
 * 각자 TopBar·Sidebar·캔버스를 조립하면 GNB 위치·배경·여백이 앱마다 갈린다(2026-11-01
 * 실측: 같은 Sidebar 를 써도 백오피스만 GNB 가 없고 바탕이 흰색이었다). 틀을 한 컴포넌트로
 * 두고 앱은 메뉴·계정 슬롯만 채운다.
 *
 * 구성원 홈(아이콘 레일)은 이 틀이 아니다 — `Rail` 을 쓴다.
 *
 * `lg` 미만은 사이드바 대신 GNB 의 메뉴 버튼이 드로어를 연다. 드로어는 `nav`·
 * `sidebarHeader`·`sidebarFooter` 를 그대로 다시 그린다 — 모바일 메뉴를 따로 만들지 않는다.
 */
export function AdminShell({
  brand,
  nav,
  sidebarHeader,
  sidebarFooter,
  topbarLeading,
  topbarActions,
  children,
  className,
  sidebarClassName,
  mainClassName,
  surfaceClassName,
  menuLabel = "메뉴",
  closeKey,
}: AdminShellProps): ReactElement {
  // 연 순간의 closeKey 를 기억한다 — 경로가 바뀌면 그 값과 달라져 저절로 닫힌다(이펙트로 setState 안 함).
  const [openedAt, setOpenedAt] = useState<{ key: unknown } | null>(null);
  const open = openedAt !== null && Object.is(openedAt.key, closeKey);
  const setOpen = useCallback(
    (next: boolean) => setOpenedAt(next ? { key: closeKey } : null),
    [closeKey],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={cn("bg-background text-foreground flex h-dvh flex-col", className)}>
      <TopBar
        className={surfaceClassName}
        rail={<div className="flex h-full items-center px-5">{brand}</div>}
        leading={
          <>
            <button
              type="button"
              aria-label={`${menuLabel} 열기`}
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="border-border text-muted hover:text-default flex size-9 items-center justify-center rounded-lg border lg:hidden"
            >
              <List aria-hidden="true" className="size-5" />
            </button>
            <div className="lg:hidden">{brand}</div>
            {topbarLeading}
          </>
        }
        actions={topbarActions}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          className={cn(surfaceClassName, sidebarClassName)}
          header={sidebarHeader}
          footer={sidebarFooter}
        >
          {nav}
        </Sidebar>
        <main
          className={cn(
            canvasClass,
            "min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8",
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
        >
          <button
            type="button"
            aria-label={`${menuLabel} 닫기`}
            tabIndex={-1}
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "bg-background absolute inset-y-0 left-0 flex w-[min(var(--sidebar-width),85vw)] flex-col shadow-2xl",
              surfaceClassName,
            )}
          >
            <div className="border-border flex h-[var(--topbar-height)] shrink-0 items-center justify-between border-b px-5">
              {brand}
              <button
                type="button"
                aria-label={`${menuLabel} 닫기`}
                onClick={() => setOpen(false)}
                className="text-muted hover:text-default flex size-9 items-center justify-center rounded-lg"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            {sidebarHeader ? <div className="shrink-0">{sidebarHeader}</div> : null}
            <div
              className="min-h-0 flex-1 overflow-y-auto px-[8px] py-[12px]"
              onClick={(e) => {
                // 메뉴 링크를 누르면 닫는다 — 같은 경로를 다시 눌러 closeKey 가 안 바뀌어도.
                if ((e.target as HTMLElement).closest("a")) {
                  setOpen(false);
                }
              }}
            >
              {nav}
            </div>
            {sidebarFooter ? <div className="shrink-0">{sidebarFooter}</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
