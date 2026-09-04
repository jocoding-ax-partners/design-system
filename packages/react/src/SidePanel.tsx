/**
 * SidePanel — 슬라이드 사이드 패널 (상세/detail/multi-step 용).
 *
 * 너비 정책: size prop → 반응형 단계 너비.
 *   mobile(<768) : w-full, min-w-[360px]
 *   md(768+)     : 480px
 *   lg(1024+)    : 520px
 *   xl(1280+)    : 560px
 *
 * body 패딩: px-5 py-5 (< md) / px-8 py-6 (md+). contentPadding=false 로 해제.
 *
 * resizable=true 이면 패널 경계선을 드래그해 너비 조절 가능.
 *   min: 320px / max: 900px
 *
 * 내부 구현은 HeroUI Drawer(react-aria) — 외부 API 는 Radix 시절과 동일하다.
 */
import { Drawer } from "@heroui/react";
import { X } from "@phosphor-icons/react";
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "./lib/cn.js";

const MIN_PANEL_W = 320;
const MAX_PANEL_W = 900;

// size variant → 반응형 너비 클래스 (resizing 중이면 inline style 이 override).
// `.drawer__dialog[data-placement=right]` 의 고정 width(24rem)를 Tailwind utilities
// 레이어로 이긴다 — components 레이어보다 utilities 가 뒤에 온다.
const RESPONSIVE_CLS: Record<NonNullable<SidePanelProps["size"]>, string> = {
  sm: "w-full min-w-[360px]",
  md: "w-full min-w-[360px] md:w-[480px]",
  lg: "w-full min-w-[360px] md:w-[480px] lg:w-[520px]",
  xl: "w-full min-w-[360px] md:w-[480px] lg:w-[520px] xl:w-[560px]",
};

/** SidePanelHeader 가 닫기 버튼을 그릴 수 있도록 close 를 내려준다(모듈 내부 전용). */
const SidePanelCloseContext = createContext<() => void>(() => {});

export interface SidePanelProps {
  open: boolean;
  /** SR 용 레이블 */
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  side?: "left" | "right";
  /** visible 헤더 — SidePanelHeader 권장 */
  header?: ReactNode;
  footer?: ReactNode;
  /** 헤더의 close X 버튼 숨김 */
  hideClose?: boolean;
  className?: string;
  /**
   * body 패딩.
   * true(기본): px-5 py-5 / md:px-8 md:py-6
   * false      : no padding (full-bleed)
   * number     : inline padding px 값
   */
  contentPadding?: boolean | number;
  /** widthPx 직접 지정 시 size preset 무시 */
  widthPx?: number;
  /** 패널 경계선 표시 여부. 기본 true */
  border?: boolean;
  /** 경계선 드래그로 너비 조절 활성화 */
  resizable?: boolean;
  children?: ReactNode;
  onOpenChange: (open: boolean) => void;
}

export function SidePanel({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  side = "right",
  header,
  footer,
  hideClose,
  className,
  contentPadding = true,
  widthPx,
  border = true,
  resizable = true,
  children,
}: SidePanelProps) {
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);
  const descriptionId = useId();

  function handleResizeStart(e: React.PointerEvent) {
    // HeroUI Drawer 의 드래그-투-디스미스(drawer.js useDrawerDrag)가 같은
    // pointerdown 을 먹으면 리사이즈 도중 패널이 닫힌다 — 여기서 끊는다.
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    startX.current = e.clientX;
    // 현재 패널 실제 너비 기준
    const panel = (e.currentTarget as HTMLElement).parentElement;
    startW.current = panel?.offsetWidth ?? widthPx ?? 480;

    function onMove(ev: PointerEvent) {
      if (!isResizing.current) {
        return;
      }
      const delta = side === "right" ? startX.current - ev.clientX : ev.clientX - startX.current;
      setDragWidth(Math.max(MIN_PANEL_W, Math.min(MAX_PANEL_W, startW.current + delta)));
    }

    function onUp() {
      isResizing.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  // open 이 닫히면 dragWidth 초기화
  function handleOpenChange(next: boolean) {
    if (!next) {
      setDragWidth(null);
    }
    onOpenChange(next);
  }

  const resolvedWidth = dragWidth ?? widthPx ?? null;

  return (
    <SidePanelCloseContext.Provider value={() => handleOpenChange(false)}>
      <Drawer isOpen={open} onOpenChange={handleOpenChange}>
        <Drawer.Backdrop>
          <Drawer.Content placement={side}>
            <Drawer.Dialog
              aria-describedby={description ? descriptionId : undefined}
              style={resolvedWidth ? { width: `${resolvedWidth}px` } : undefined}
              className={cn(
                // HeroUI Drawer 는 dialog 에 24px 패딩을 주지만 SidePanel 은
                // header/body/footer 가 각자 패딩을 갖는 구조라 0 으로 되돌린다.
                "p-0",
                resolvedWidth ? "max-w-none" : RESPONSIVE_CLS[size],
                // 진입 모션은 HeroUI 것만 쓴다. Radix 시절의 side-panel-enter-* 는
                // `[data-entering] { translate: ±100% }` 전환(250ms)과 같은 요소에서
                // transform·opacity 를 따로 애니메이션해(240ms) 깜빡임을 만들었다.
                side === "right"
                  ? border && "border-l border-[var(--border-default)]"
                  : border && "border-r border-[var(--border-default)]",
                className,
              )}
            >
              {/* SR-only */}
              <Drawer.Heading className="sr-only">{title}</Drawer.Heading>
              {description && (
                <p id={descriptionId} className="sr-only">
                  {description}
                </p>
              )}

              {/* 드래그 리사이즈 핸들 — 1px 선 + 넓은 hit area */}
              {resizable && (
                <div
                  onPointerDown={handleResizeStart}
                  className={cn(
                    "group absolute top-0 bottom-0 z-10 w-3 cursor-col-resize",
                    side === "right" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0 bottom-0 w-px transition-colors",
                      "bg-transparent group-hover:bg-[color:var(--primary)] group-active:bg-[color:var(--primary)]",
                      side === "right" ? "left-1/2" : "right-1/2",
                    )}
                  />
                </div>
              )}

              {header}

              {/* body — data-slot 은 HeroUI 의 드래그-투-디스미스 제외 대상 셀렉터
                  (`[data-slot='drawer-body']`, drawer.js) 에 걸리게 하려는 것이다.
                  스타일은 클래스 기반이라 이 속성만으로 붙지 않는다. */}
              <div
                data-slot="drawer-body"
                className={cn(
                  "min-h-0 flex-1 overflow-auto",
                  typeof contentPadding === "boolean" &&
                    contentPadding &&
                    "px-5 py-5 md:px-8 md:py-6",
                )}
                style={typeof contentPadding === "number" ? { padding: contentPadding } : undefined}
              >
                {children}
              </div>

              {footer}

              {!hideClose && !header && (
                <button
                  type="button"
                  aria-label="닫기"
                  onClick={() => handleOpenChange(false)}
                  className="absolute top-[26px] right-[26px] rounded-md p-1.5 text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--fg-default)]"
                >
                  <X size={20} weight="regular" />
                </button>
              )}
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </SidePanelCloseContext.Provider>
  );
}

/** 표준 헤더 — title + description + close X.
 *  custom header 필요 시 자유롭게 작성해도 OK. */
export const SidePanelHeader = forwardRef<
  HTMLElement,
  {
    title?: ReactNode;
    description?: ReactNode;
    eyebrow?: ReactNode;
    actions?: ReactNode;
    className?: string;
    children?: ReactNode;
  }
>(function SidePanelHeader({ title, description, eyebrow, actions, className, children }, ref) {
  const close = useContext(SidePanelCloseContext);
  return (
    <header
      ref={ref}
      className={cn(
        "flex items-start justify-between gap-3 px-5 pt-5 pb-4 md:px-8",
        "shrink-0 border-b border-[var(--border-default)]",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        {eyebrow}
        {title && <div className="t-card-title truncate text-[var(--fg-default)]">{title}</div>}
        {description && <div className="t-caption text-[var(--fg-muted)]">{description}</div>}
        {children}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {actions}
        <button
          type="button"
          aria-label="닫기"
          onClick={close}
          className="rounded-md p-1.5 text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--fg-default)]"
        >
          <X size={20} weight="regular" />
        </button>
      </div>
    </header>
  );
});

export function SidePanelFooter({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <footer
      className={cn(
        "px-5 py-4 md:px-8",
        "flex shrink-0 justify-end gap-2 border-t border-[var(--border-default)]",
        className,
      )}
    >
      {children}
    </footer>
  );
}
