---
"@jocoding-ax-partners/react": minor
"@jocoding-ax-partners/tailwind": minor
"@jocoding-ax-partners/design-system": minor
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
  `@jocoding-ax-partners/tailwind` 은 `private: true` 라 배포되지 않는다 — 이 토큰들이
  소비 앱에 닿는 경로는 `@jocoding-ax-partners/design-system` 의 CSS 뿐이다
  (`packages/heroui/src/styles/index.css` 가 tailwind 테마를 import 해 dist 에 인라인한다).
  그래서 이 changeset 은 `design-system` 도 함께 올린다. 안 올리면 새 컴포넌트가 쓰는
  `h-[var(--topbar-height)]` 가 소비 앱에서 미정의로 남아 헤더 높이가 무너진다.
- 아이콘 세트는 `@phosphor-icons/react` 하나로 강제된다 — eslint `no-restricted-imports` 가
  `@iconify/*` · `lucide-react` · `react-icons` · `@radix-ui/react-icons` · `@heroicons/*` 를
  막는다. 타입은 `lib/icon.ts` 가 단일 출처이고, 아이콘 컴포넌트는 Phosphor 에서 직접 가져온다.
- 활성 내비 항목의 표현은 정본을 따라 **배경 없이** 굵기와 색만 바꾼다(`itemClass()`).
  색은 `activeColor` 로 주입되므로 화이트라벨 테넌트가 자기 색을 넣을 수 있다.

버전 결과: `design-system` 이 minor 로 올라가면서 `react` 의 peerDependency
(`@jocoding-ax-partners/design-system: workspace:^`)가 바뀌므로 changesets 가
`react` 를 **major(1.0.0 → 2.0.0)** 로 올린다. 의도한 것이다 — 이 릴리스의 컴포넌트는
새 CSS 없이는 동작하지 않는다(`h-[var(--topbar-height)]` 가 미정의가 되어 헤더 높이가
무너진다). major 라야 소비자가 CSS 를 같이 올려야 한다는 걸 알아챈다.
