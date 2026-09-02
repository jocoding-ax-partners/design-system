import { AlertDialog, Button } from "@heroui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * ConfirmDialog — design system §4.8 modal 컨벤션의 confirmation 패턴.
 *
 * window.confirm 의 대체. variant 별 색/아이콘은 HeroUI `AlertDialog.Icon` 의
 * status 를 그대로 쓴다(danger / warning / default).
 *
 * Hook 형: useConfirm() 로 promise 기반 호출. Provider 가 root 에 1번.
 */

type ConfirmVariant = "danger" | "warning" | "info";

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  /** 추가 details — 영향 분석 등 */
  details?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

type Resolver = (ok: boolean) => void;

const ConfirmCtx = createContext<((opts: ConfirmOptions) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ opts: ConfirmOptions; resolve: Resolver } | null>(null);
  const stateRef = useRef(state);
  // eslint-disable-next-line react-hooks/refs -- latest-ref: Esc 핸들러의 stale closure 방지
  stateRef.current = state;

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      // 직전 confirm 이 아직 열려 있으면 그 promise 를 false 로 정리하고 교체한다.
      // (연속 호출 시 이전 await 가 영영 settle 되지 않아 그 핸들러가 묻히는 것 방지.)
      setState((prev) => {
        prev?.resolve(false);
        return { opts, resolve };
      });
    });
  }, []);

  const close = useCallback((ok: boolean) => {
    stateRef.current?.resolve(ok);
    setState(null);
  }, []);

  // Esc 닫기 — AlertDialog.Backdrop 의 isKeyboardDismissDisabled={false} 가
  // onOpenChange(false) 를 부르므로 아래 리스너는 이중 안전망이다(중복 호출돼도
  // close() 가 state 를 null 로 만들어 resolve 는 1회만 일어난다).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close(false);
      }
    }
    if (state) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [state, close]);

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state && <ConfirmModal opts={state.opts} onClose={close} />}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) {
    throw new Error("useConfirm: ConfirmProvider 가 필요해요");
  }
  return ctx;
}

/** variant → HeroUI AlertDialog.Icon status */
const ICON_STATUS: Record<ConfirmVariant, "danger" | "warning" | "default"> = {
  danger: "danger",
  warning: "warning",
  info: "default",
};

function ConfirmModal({ opts, onClose }: { opts: ConfirmOptions; onClose: (ok: boolean) => void }) {
  const variant: ConfirmVariant = opts.variant ?? "info";
  const buttonVariant: "danger" | "primary" = variant === "danger" ? "danger" : "primary";

  return (
    <AlertDialog isOpen onOpenChange={(willOpen) => !willOpen && onClose(false)}>
      {/* AlertDialog 기본값은 isDismissable=false / isKeyboardDismissDisabled=true 라
          Radix 시절 동작(Esc·바깥 클릭 닫힘)을 유지하려면 둘 다 명시해야 한다. */}
      <AlertDialog.Backdrop isDismissable isKeyboardDismissDisabled={false}>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status={ICON_STATUS[variant]} />
              <AlertDialog.Heading>{opts.title}</AlertDialog.Heading>
            </AlertDialog.Header>
            {(opts.description || opts.details) && (
              <AlertDialog.Body className="flex flex-col gap-2">
                {opts.description}
                {opts.details && (
                  // .t-caption 이 unlayered 라 text-* 유틸을 이긴다 — 색은 인라인 style 로만 유지된다
                  <div
                    className="t-caption rounded-[8px] px-3 py-2"
                    style={{ background: "var(--bg-muted)", color: "var(--fg-secondary)" }}
                  >
                    {opts.details}
                  </div>
                )}
              </AlertDialog.Body>
            )}
            <AlertDialog.Footer>
              <Button variant="outline" onClick={() => onClose(false)}>
                {opts.cancelLabel ?? "취소"}
              </Button>
              <Button variant={buttonVariant} onClick={() => onClose(true)} autoFocus>
                {opts.confirmLabel ?? "확인"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
