# 조코딩AX파트너스 브랜드 정본 — 세 제품을 한 디자인으로

> 측정일 2026-11-01. 배포된 번들의 CSS 를 직접 내려받아 `:root`/`.dark` 커스텀 속성을 뽑아 비교했다.
> 근거 파일: `jocodingax.axhub.ai/assets/main-*.css`, `admin.axhub.ai/assets/index-*.css`,
> 각 저장소 `origin/main` 의 전역 CSS.

## 정본은 어디서 오는가

회사 사이트 [jocodingax.ai](https://jocodingax.ai) 가 쓰는 색이 이 패키지의 램프와 **이미 같다**:
`#16171b`(gray-900) · `#3c3f47`(gray-700) · `#6d717e`(gray-500) · `#9ca0ab` · `#e4e5e8` ·
브랜드 블루 `#2d64fa`, 서체 Pretendard. 즉 정본의 값이 틀린 게 아니라 **세 제품이 정본을 안 받거나
옛 버전을 받거나, 정본에 없는 것을 각자 만들고 있는 것**이 "전부 다른 디자인"의 원인이다.

| 축 | 정본 | 
|---|---|
| 브랜드 블루 | `#2d64fa` = `--primary-base` = `--color-accent-600` = `--color-primary-600` |
| 뉴트럴 | `--color-gray-50…950` (색상각 264→286, 푸른 회색) |
| 서체 | `--font-sans` Pretendard Variable 스택 (5.1 부터 정본 소유) |
| 상태색 | `--danger`·`--success`·`--warning`·`--info` + `-strong`(700) · `-soft-foreground`(800) |
| 차트 | `--chart-1…8`, `--chart-other` (5.1 신설) |
| 모션 | `--duration-fast/base/slow`, `--ease-standard`, `--ease-out` (5.1 신설) |
| 캔버스 | `bg-canvas` — 관리자 콘솔 바닥(gray-100, 다크는 gray-900/950 혼합). 카드가 그 위에 선다 (5.1 신설) |
| 테넌트 색 | `<html data-brand-theme style="--primary:…">` 한 줄로 primary 한 벌 + accent 램프 파생 (5.1 신설) |

## 세 제품의 현재 상태 (실측)

| | jocodingax.axhub.ai (콘솔) | admin.axhub.ai | axclass.jocodingax.axhub.ai |
|---|---|---|---|
| 저장소 | `axhub-mono/apps/frontend` | `axhub-mono/apps/frontend-admin` | `axhub-axacademy` |
| 정본 패키지 | 4.1.0 + 로컬 patch | **없음** | 4.2.0 |
| 브랜드 블루 | `#2d64fa` ✅ | `--app-brand: #2D64FA` ✅ (이름만 다름) | `--blue`/`--accent: #2d64fa` ✅ |
| 뉴트럴 | 정본 gray ✅ (단 200·300·400 은 Tailwind 기본값이 샘 — 4.x 버그) | 독자 쿨그레이 `#232734`·`#6b7280`·`#e4e7ee` ❌ | 독자 `--ink:#171b25`·`--muted:#656d7b`·`--line:#e5e9f0` + `--fds-n30…950` ❌ |
| 상태색 | 정본 (4.x — danger `#ef1026`, AA 미달 쌍 다수) | Tailwind 기본 `#EF4444`·`#10B981`·`#F59E0B` ❌ | `--fds-red:#fc1c49`·`--fds-green:#4caf50`·`--fds-orange:#f8930f` ❌ |
| 서체 | 로컬 `--font-sans` Pretendard | Pretendard 번들, 단 HeroUI `--font-sans` 는 system-ui | Pretendard **CDN**(분리망에서 실패) |
| primary 램프 | `data-home-theme` 로컬 파생 | `--color-primary-50…950` 로컬 `color-mix` | `--fds-primary-50`·`--pale` 등 낱개 |
| 다크 | 정본 | 독자 `#16151A`/`#1C1B21` | 없음 |

## 5.1 에서 정본이 흡수한 것

각 앱이 로컬로 만들던 것 중 **둘 이상이 필요로 하거나, 한 앱이 정성 들여 설계했는데 다른 앱도 곧 필요한 것**만 올렸다.

1. **`--font-sans`/`--font-mono`** — 세 앱 + 회사 사이트가 모두 Pretendard 인데 스택을 각자 적었다.
   폰트 파일은 싣지 않는다(CSS 전용 패키지, 분리망). 앱에서 `pretendard` 패키지를 self-host 한다:
   `import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"`.
2. **`--color-primary-50…950`** — accent 램프와 같은 값의 별칭. admin 의 로컬 `color-mix` 램프,
   axclass 의 `--fds-primary-*`·`--pale` 을 대체한다.
3. **테넌트 브랜드 `[data-brand-theme]`** — 콘솔의 `data-home-theme` 파생 규칙을 그대로 올렸다.
   `data-home-theme` 도 별칭으로 받으므로 콘솔은 로컬 블록만 지우면 된다.
4. **`--chart-1…8`·`--chart-other`** — admin 이 상태색과 겹치지 않게 고른 범주색(라이트/다크).
5. **모션** — 콘솔의 `--duration-*`·`--ease-*`.

## 공통 셸 컴포넌트 (`@jocoding-ax-partners/react` 3.1)

토큰만 같으면 "같은 색의 다른 화면"이 된다. 사이드바·GNB·카드는 **컴포넌트를 같이 쓴다.**
정본은 콘솔(jocodingax.axhub.ai)이고, 아래 컴포넌트는 콘솔 코드에서 그대로 떼어 냈다.

| 자리 | 컴포넌트 | 정본 |
|---|---|---|
| 관리자 사이드바 (244px) | `Sidebar` + `NavList`/`NavItem` (`itemClass`) — 15px · 32px 행 · primary 활성 | `layout/InnerSidebar.tsx` |
| 사용자 레일 (떠 있는 52px 타일) | `Rail` + `RailTile` (`railTileClass`·`RailTileContent`) | `layout/RailSidebar.tsx`·`RailTile.tsx` |
| GNB (60px) | `TopBar` (`surface: default | transparent | content`), 계정 메뉴가 필요하면 `AppHeader` | `layout/Topbar.tsx` |
| 카드 | `Card` (`padding: md | none`), `CardEmpty`, 클래스 `cardClass`·`cardFlushClass` | `layout/consoleCard.ts` |
| 바닥 | `canvasClass` = `bg-canvas` | `CONSOLE_CANVAS` |
| 본문 폭 | `PageContainer` (1600 · pt-5 md:pt-10) | `layout/PageContainer.tsx` |
| **관리자 화면 틀** | `AdminShell` — GNB 60 + 사이드바 244 + 캔버스 본문, 모바일 드로어 포함 | admin.axhub.ai `layout/AdminLayout.tsx` |
| 관리자 페이지 제목 | `PageHeader density="compact"` — 56px 한 줄 · 제목 24px · 설명 14px | admin.axhub.ai `shared/PageHeader.tsx` |

**관리자 화면은 `AdminShell` 하나로 그린다** (2026-11-01 결정). 플랫폼 어드민·콘솔 관리·AXLMS 백오피스·
APTA 운영·axacademy 관리자가 같은 `Sidebar` 를 써도 GNB 자리·바탕·제목 모양을 각자 조립해 다른 제품처럼
보였다. 앱은 `brand`·`nav`·계정 슬롯만 채운다. 구성원 홈은 이 틀이 아니라 `Rail` 이다 — 레일은 영역(홈·앱·데이터·설정)을
고르는 1단 탐색, 사이드바는 한 영역 안의 화면 목록(2단)이다.

소비 앱은 이 패키지의 `dist` 를 Tailwind 가 훑게 한다: `@source "../node_modules/@jocoding-ax-partners/react/dist";`.

## 앱별 이행 지도

규칙은 [consumers.md](./consumers.md) 의 별칭 레이어와 같다: **오른쪽에는 `var(...)` 만**.
값을 앱이 만들면 정본이 둘이 된다.

### admin.axhub.ai (`apps/frontend-admin`) — 정본 미설치

1. `@jocoding-ax-partners/design-system@^5` 설치, `@import` 순서 `tailwindcss → @heroui/styles → 정본`.
2. `--app-*` 를 지우지 말고 **오른쪽만** 정본으로 바꾼다(참조 코드 수정 0줄):

| admin 토큰 | 정본 |
|---|---|
| `--app-background` | `var(--bg-surface)` |
| `--app-surface` | `var(--bg-content)` |
| `--app-subtle` / `--app-table-head` / `--app-input-fill` | `var(--bg-muted)` |
| `--app-foreground` | `var(--fg-default)` |
| `--app-secondary` / `--app-tertiary` | `var(--fg-secondary)` |
| `--app-muted` | `var(--fg-muted)` |
| `--app-placeholder` | `var(--fg-subtle)` |
| `--app-border` / `--app-field-border` | `var(--border-default)` |
| `--app-border-strong` | `var(--border-strong)` |
| `--app-brand` / `-hover` / `-surface` / `-light` / `-fg` | `var(--primary)` / `var(--primary-hover)` / `var(--primary-soft)` / `var(--primary-soft-hover)` / `var(--fg-on-primary)` |
| `--app-brand-pressed` / `-border` / `-muted` | `var(--color-primary-700)` / `var(--color-primary-200)` / `var(--color-primary-400)` |
| `--app-error` / `-surface` / `-fg` | `var(--danger)` / `var(--danger-soft)` / `var(--danger-strong)` |
| `--app-caution` / `-surface` / `-fg` | `var(--warning)` / `var(--warning-soft)` / `var(--warning-strong)` |
| `--app-ok` / `-surface` / `-fg` | `var(--success)` / `var(--success-soft)` / `var(--success-strong)` |
| `--app-info` / `-surface` / `-fg` | `var(--info)` / `var(--info-soft)` / `var(--info-strong)` |
| `--app-icon-inactive` | `var(--icon-inactive)` |
| `--app-cat-1…8` / `--app-cat-other` | `var(--chart-1…8)` / `var(--chart-other)` |
| `--app-layout-bg` | `var(--dark-muted)` (테넌트 레일 — 양 테마 공통 어두운 톤) |

3. 로컬 `--color-primary-50…950` `@theme` 블록 삭제(정본이 같은 이름으로 준다).
4. `--app-purple`·`--app-waiting`·`--app-progress-*`·`--app-cat-platform` 은 도메인 색 — 앱이 계속 소유한다.
5. 함정: `--color-surface`·`--color-foreground`·`--color-muted` 등 admin 의 `@theme inline` 이름은
   HeroUI 이름과 겹친다. 이행 후 `card`·`chip` 렌더를 Storybook 대조표와 눈으로 비교한다.

### axclass (`axhub-axacademy`) — 정본 4.2.0 위에 독자 팔레트

| axclass 토큰 | 정본 |
|---|---|
| `--ink` / `--fc-ink` | `var(--fg-default)` |
| `--muted` / `--fc-sub` | `var(--fg-muted)` |
| `--line` / `--fc-line` / `--fds-n50` | `var(--border-default)` |
| `--canvas` / `--fc-bg` / `--fds-n30` | `var(--bg-surface)` |
| `--blue` / `--accent` / `--fds-primary` | `var(--primary)` |
| `--pale` / `--fds-primary-50` | `var(--primary-soft)` |
| `--fds-primary-low` | `var(--color-primary-200)` |
| `--fds-n100…950` | `var(--color-gray-200…950)` (한 단계씩 대응, 화면 대조로 확정) |
| `--fds-red` / `--fds-red-50` | `var(--danger)` / `var(--danger-soft)` |
| `--fds-green` / `--fds-orange` / `--fds-blue` | `var(--success)` / `var(--warning)` / `var(--info)` |
| `--fds-r4` / `--fds-r8` / `--fds-r12` | `var(--radius-sm)` / `var(--radius-lg)` / `var(--radius-xl)` |

- `--sale: #fc1c49` 는 가격 강조라는 **도메인 색**이다. 앱이 소유하되 값은 `var(--danger)` 로 잇는 걸 권한다.
- Pretendard CDN `@import` 를 지우고 self-host 로 바꾼다(정본 `--font-sans` 가 스택을 준다).
- 헤더 높이 `--header-h: 68px` 는 마케팅형 GNB 라 정본 `--topbar-height`(60px, 콘솔 셸)와 다르다 — L4, 앱 소유.

### jocodingax.axhub.ai (`apps/frontend`) — 정본 4.1.0

1. 5.1 로 올리고 `patches/@jocoding-ax-partners__design-system@4.1.0.patch` 가 아직 필요한지 확인한다.
2. `globals.css` 의 `:root[data-home-theme]` 블록 두 개(primary 파생·accent 램프)를 삭제한다 —
   정본이 같은 공식을 `data-home-theme` 별칭으로 받는다. 새 코드는 `data-brand-theme` 을 쓴다.
3. 로컬 `--font-sans`·`--font-mono`·`--duration-*`·`--ease-*` 삭제.
4. 4.x 에서 쓰던 `--danger: #ef1026`, `-strong = base` 값은 5.0 에서 AA 를 넘는 값으로 바뀐다
   (`.changeset/token-ramp-and-contrast.md`). 상태 텍스트·soft 배지가 한 단계 진해진다.

## 소유하지 않는 것 (L4)

밀도, GNB 높이·구조, 마케팅 페이지 레이아웃, 가격 강조색, 도메인 상태(승인 대기 등).
제품이 다르면 다른 것이 맞다. 다만 **값**은 정본 토큰에서 받는다.
