import { DotsThreeVertical, SignOut } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";

import { useAdminShell } from "./AdminShell.js";
import { cn } from "./lib/cn.js";

export interface AdminAccountProps {
  /** 이름. 없으면 이메일 등을 넘긴다. */
  name: ReactNode;
  /** 이름 아래 잔글씨 — 이메일·역할. */
  detail?: ReactNode;
  /** 아바타 자리. 없으면 `initial` 글자 원을 그린다. */
  avatar?: ReactNode;
  initial?: string;
  /** 메뉴의 「테마」 줄에 놓을 토글. */
  theme?: ReactNode;
  logoutLabel?: string;
  logoutBusy?: boolean;
  /** 메뉴 버튼 아래 한 줄 알림 — 로그아웃 실패 등. */
  error?: ReactNode;
  /** 메뉴에 더할 항목. */
  children?: ReactNode;
  className?: string;
  /** 주면 메뉴에 로그아웃을 그린다. */
  onLogout?: () => void;
}

/**
 * 사이드바 아래 계정 영역. 정본은 admin.axhub.ai `SidebarProfile` — 아바타 · 이름 · 잔글씨 · 세로 ⋯ 메뉴(테마 · 로그아웃).
 *
 * 메뉴는 넓은 폭에서 사이드바 **밖**(오른쪽)으로, 좁은 폭(드로어)에서는 버튼 **위**로 연다 — 드로어 오른쪽은 화면 끝이라
 * 밖으로 열면 잘린다. 접힌 띠에서는 아바타와 ⋯ 만 세로로 남긴다.
 */
export function AdminAccount({
  name,
  detail,
  avatar,
  initial,
  theme,
  onLogout,
  logoutLabel = "로그아웃",
  logoutBusy = false,
  error,
  children,
  className,
}: AdminAccountProps): ReactElement {
  const { collapsed } = useAdminShell();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn("border-border relative border-t p-3", collapsed && "px-1.5", className)}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-1.5",
          collapsed && "flex-col gap-1 px-0",
        )}
      >
        {avatar ?? (
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary)]"
          >
            {initial}
          </span>
        )}
        <div className={cn("min-w-0 flex-1", collapsed && "sr-only")}>
          <p className="truncate text-xs font-medium">{name}</p>
          {detail ? <p className="text-muted truncate text-[10px]">{detail}</p> : null}
        </div>
        <div className="relative">
          <button
            type="button"
            aria-label="계정 메뉴"
            aria-haspopup="menu"
            aria-expanded={open}
            data-testid="account-toggle"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "text-muted hover:text-default flex size-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-[var(--opacity-gray-50)] dark:hover:bg-[var(--opacity-white-50)]",
              open && "text-default bg-[var(--opacity-gray-50)] dark:bg-[var(--opacity-white-50)]",
            )}
          >
            <DotsThreeVertical aria-hidden="true" weight="bold" className="size-4" />
          </button>
          {open ? (
            <div
              role="menu"
              aria-label="계정 메뉴"
              className="border-border bg-content absolute right-0 bottom-full z-50 mb-2 flex w-[240px] flex-col rounded-[12px] border p-3 shadow-lg lg:right-auto lg:bottom-0 lg:left-full lg:mb-0 lg:ml-2"
            >
              {theme ? (
                <div className="flex items-center justify-between gap-2 px-3 py-1.5">
                  <span className="text-muted text-[14px]">테마</span>
                  {theme}
                </div>
              ) : null}
              {children}
              {onLogout ? (
                <>
                  {theme || children ? <div className="border-border my-1 border-t" /> : null}
                  <button
                    type="button"
                    role="menuitem"
                    disabled={logoutBusy}
                    onClick={onLogout}
                    style={{ color: "var(--danger)" }}
                    className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-[14px] transition-colors hover:bg-[var(--opacity-gray-50)] disabled:opacity-60 dark:hover:bg-[var(--opacity-white-50)]"
                  >
                    <SignOut aria-hidden="true" className="size-4 shrink-0" />
                    {logoutLabel}
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {error ? (
        <p role="alert" className="px-2 pt-1 text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
