---
"@jocoding-ax-partners/react": minor
"@jocoding-ax-partners/tailwind": minor
---

내비게이션·셸 컴포넌트 승격 (정본: axhub-frontend).

- `NavItem` · `NavList` · `Sidebar` — 사이드바. 접근성이 API 모양으로 강제된다
  (`<a>`/`<button>` 만 렌더 가능, `href` 도 `onSelect` 도 없으면 throw — `<div onClick>`
  내비 항목을 표현 불가능하게 만든다).
- `TopBar` · `Breadcrumbs` — 60px 상단 크롬(`--topbar-height`). `Breadcrumbs` 는 마지막
  크럼을 `href` 가 있어도 링크로 만들지 않는다.
- `PageHeader` · `PageContainer` · `TabNav` — 페이지 셸. `PageContainer` 가 바깥 여백의
  단일 소유자. `TabNav` 는 `role="tablist"`/`role="tab"`/`aria-selected` 를 갖춘다.
- 라우터 비의존: AxHub 는 `react-router-dom`, APTA 는 `react-router` 를 쓰므로 두 패키지
  다 import 하지 않고, 소비 앱이 `renderLink` 로 자기 `Link` 를 주입한다.
- 접근성은 관행이 아니라 API 모양으로 강제된다 — `NavItem` 의 throw 외에도 AxHub 에는
  없던 `focus-visible` 링, 아이콘 `aria-hidden`, 아코디언 트리거 `aria-expanded`,
  `role="group"`+`aria-labelledby` 섹션을 패키지가 추가한다.
- `@jocoding-ax-partners/tailwind` 가 셸 치수·아이콘 색 토큰을 새로 소유한다:
  `--sidebar-width`(244px) · `--topbar-height`(60px) · `--icon-inactive`
  (라이트 `gray-300` / 다크 `gray-500`).
