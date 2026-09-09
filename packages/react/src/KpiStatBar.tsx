import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "./lib/cn.js";
import { SearchBox } from "./SearchBox.js";

export interface KpiStatItem {
  label: string;
  labelClassName?: string;
  value: ReactNode;
  description?: string;
}

export interface KpiStatBarProps {
  items: KpiStatItem[];
  actions?: ReactNode;
  className?: string;
}

export function KpiStatBar({ items, actions, className }: KpiStatBarProps) {
  return (
    <div
      className={cn(
        "full-bleed border-interactive px-container flex w-full min-w-0 flex-col items-stretch gap-5 border-y py-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col items-stretch gap-5 sm:flex-row sm:items-center">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex min-w-0 flex-1 flex-col",
              item.description ? "max-w-[320px]" : "max-w-[240px]",
            )}
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "shrink-0 text-[16px] font-semibold tracking-[-0.16px]",
                  item.labelClassName ?? "text-muted",
                )}
              >
                {item.label}
              </span>
              {/* AxHub origin/main 4cd7597 uses 24px here; stale prose still says 32px. */}
              <span className="text-default text-[24px] leading-[1.2] font-bold tabular-nums">
                {item.value}
              </span>
            </div>
            {item.description && (
              <p className="text-muted mt-0.5 text-[13px]">{item.description}</p>
            )}
          </div>
        ))}
      </div>
      {actions && <div className="ml-auto shrink-0">{actions}</div>}
    </div>
  );
}

export interface KpiSearchButtonProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function KpiSearchButton({ value, onChange, placeholder = "검색" }: KpiSearchButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function closeOnOutsidePress(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutsidePress);
    return () => document.removeEventListener("mousedown", closeOnOutsidePress);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => buttonRef.current?.focus());
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={placeholder}
        aria-expanded={open}
        className={cn(
          "flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border transition-colors",
          open
            ? "bg-primary-soft border-[color:var(--primary)] text-[color:var(--primary)]"
            : "border-interactive bg-content text-default hover:bg-muted",
        )}
      >
        <MagnifyingGlass size={18} weight="regular" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] right-[calc(-1*var(--container-pad-sm))] z-30 w-[min(380px,calc(100vw-2rem))] sm:right-0 sm:w-[380px]">
          <SearchBox
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            widthClass="w-full"
          />
        </div>
      )}
    </div>
  );
}
