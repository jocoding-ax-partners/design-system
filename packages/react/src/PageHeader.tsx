import type { NavLinkRenderer } from "./NavItem.js";
import type { ReactElement, ReactNode } from "react";

import { ArrowLeft } from "@phosphor-icons/react";

import { cn } from "./lib/cn.js";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** 주면 제목 위에 뒤로 링크를 그린다. */
  backTo?: string;
  backLabel?: ReactNode;
  titleClassName?: string;
  /**
   * 제목 오른쪽 중앙 영역(탭·필터 등). 정본과 같은 **노드 슬롯**이다
   * (axhub-frontend shared/PageHeader.tsx:26,:52). 한때 `boolean` 으로 바뀌어
   * `justify-center text-center` 를 붙이는 스위치였는데, 정본 소비자가
   * `center={<Tabs/>}` 를 주면 boolean 강제변환이 되는 의미 변경이라 되돌렸다.
   */
  center?: ReactNode;
  actions?: ReactNode;
  renderLink?: NavLinkRenderer;
}

const DEFAULT_LINK: NavLinkRenderer = (props) => <a {...props} />;

/**
 * 정본은 axhub-frontend `shared/PageHeader.tsx`. 클래스 문자열을 바꾸지 않는다.
 *
 * 마크업도 정본 그대로다 — 바깥 `flex shrink-0 items-end gap-5` 안에
 * `flex flex-1 items-end gap-6` 래퍼가 있고, 그 안이 텍스트 컬럼 + `center` 슬롯이며,
 * `actions` 는 그 래퍼 **밖**에 온다(정본 :41-56). 한때 이 래퍼가 통째로 빠져 있었는데,
 * 클래스 문자열만 재는 테스트는 그런 마크업 차이를 못 본다.
 *
 * 정본과 다른 곳은 텍스트 컬럼의 `min-w-0` 한 군데다(정본은 맨 `flex-1`). 현실적인
 * 제목 길이에서는 계산이 같고, 줄바꿈 지점이 없는 아주 긴 제목에서만 갈린다
 * (2026-09-09 AxHub 실측, 폭 500px: 정본 본문 폭 1151.9px / 이쪽 180px — 제목이
 * 헤더를 밀어내는 대신 안에서 줄어든다). 소비 앱이 바뀐 쪽을 낫다고 보고 받아들였고
 * (axhub-frontend `shared/PageHeader.tsx` 주석), changeset 의 이탈 목록에 적혀 있다.
 */
export function PageHeader({
  title,
  description,
  backTo,
  backLabel = "뒤로",
  titleClassName,
  center,
  actions,
  renderLink = DEFAULT_LINK,
}: PageHeaderProps): ReactElement {
  return (
    <div className="flex shrink-0 items-end gap-5">
      <div className="flex flex-1 items-end gap-6">
        <div className="min-w-0 flex-1">
          {backTo
            ? renderLink({
                href: backTo,
                className:
                  "inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-default mb-0.5 focus-visible:ring-focus focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                children: (
                  <>
                    <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                    {backLabel}
                  </>
                ),
              })
            : null}
          <h1 className={cn("text-default text-[32px] font-bold", titleClassName)}>{title}</h1>
          {description ? <p className="text-muted mt-3 text-[18px]">{description}</p> : null}
        </div>
        {center}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
