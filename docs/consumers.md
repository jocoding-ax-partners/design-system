# 소비자 계약 — 이 패키지가 무엇을 주고 무엇을 안 주는가

## 소비자 현황 (2026-09)

| 소비자 | 붙은 방식 | 비고 |
|---|---|---|
| `axhub-frontend` | `@jocoding-ax-partners/design-system` 직접 | 토큰 이름을 정본 이름 그대로 쓴다 |
| `axhub-axdiag` `apps/admin` | 같은 패키지의 **옛 이름 `@demodev-ui/react`** 로 오래 쓰다 4.0.0 으로 업그레이드 | 자기 이름을 정본에 잇는 **별칭 레이어**를 둔다 |

두 번째 줄이 중요하다. axdiag 는 "새로 채택한 소비자"가 아니라 **리네임 전부터의 소비자**였다.
`@demodev-ui/react` 는 `@jocoding-ax-partners/design-system` 의 옛 이름이고(`pnpm-lock.yaml` 에
`deprecated: renamed to @jocoding-ax-partners/design-system` 표기, 2.7.4 tarball 의
`package.json` 은 4.0.0 과 exports·files·peer·sideEffects 가 동일), axdiag admin 은 처음부터
이 패키지의 소비자였다. 그래서 이 문서의 근거는 "처음 붙여 봤더니"가 아니라
**"2.7.4 에서 4.0.0 으로 올려 봤더니"** 다. dist CSS 는 1661줄(2.7.4) → 2011줄(4.0.0), 차이
378줄이 전부 시맨틱 층 추가다(`--primary-*`·`*-strong`·`--bg-*`/`--fg-*`/`--border-*` 등
97개 신규 토큰). **사라진 토큰·클래스는 0종** — 이 업그레이드로 새로 깨지는 것은 없다. 그
시맨틱 층 덕분에 소비자가 로컬에서 직접 만들던 값을 정본에 넘길 수 있게 됐다.

## 층

| 층 | 이 패키지가 소유하는가 | 무엇 |
|---|---|---|
| **L1 값** | **소유한다** | 색·타이포·간격·radius·모션·시맨틱 역할(`--fg-*`·`--bg-*`·`--border-*`)·라이트/다크 쌍 |
| **L2 컴포넌트 클래스** | **HeroUI 어휘 안에서만 소유한다** | `@layer components` 의 클래스는 HeroUI v3 컴포넌트 클래스의 오버라이드다. HeroUI 를 안 쓰는 소비자에게는 절반만 닿는다. |
| **L3 React 컴포넌트** | **조건부로 소유한다** | 실제 소비자가 2개 이상일 때만 올린다. |
| **L4 밀도·정보구조·도메인 화면** | **소유하지 않는다** | 제품이 다르면 다른 것이 맞다. 차이가 값이면 토큰 축(`[data-density]`)으로 흡수하고, 차이가 구조면 앱이 소유한다. |

## 새 소비자 배선 체크리스트

1. `package.json` — `@jocoding-ax-partners/design-system` 과 그 peer 3종:
   `@heroui/react ^3.2.4` · `@heroui/styles ^3.2.4` · `tailwindcss ^4`.
   `@jocoding-ax-partners/react` 도 쓸 거라면 그 패키지의 peer 5종:
   `@heroui/react ^3.2.4` · `@phosphor-icons/react ^2.1.10` · `react ^19` · `react-dom ^19` ·
   `@jocoding-ax-partners/design-system ^4.0.0`.
   **`@heroui/react` 는 컴포넌트를 한 곳도 안 써도 설치해야 한다** — peer 다.
2. 전역 CSS 의 `@import` 순서: `tailwindcss` → `@heroui/styles` → `@jocoding-ax-partners/design-system/styles`.
   **바뀌면** 정본의 컴포넌트 클래스 오버라이드가 HeroUI 원본에 덮인다.
3. `@jocoding-ax-partners/react` 를 쓰면 전역 CSS 에
   `@source "<상대경로>/node_modules/@jocoding-ax-partners/react/dist";`.
   **없으면** 그 컴포넌트가 스타일 없이 조용히 렌더된다. Tailwind v4 는 `node_modules` 를 스캔하지 않는다.
   경로는 **소비자의 패키지 루트 기준**이다 — pnpm isolated 링커에서 이 패키지는 워크스페이스
   레포 루트가 아니라 **그 패키지 자신의 `node_modules/`** 에 심링크로 놓인다.
   (`@jocoding-ax-partners/react@0.1.2` 의 `exports` 는 `"."` 하나뿐이라 `./styles` 서브패스가
   없다. 그래서 `@import` 가 아니라 `@source` 로 해결해야 한다.)
4. 다크는 `[data-theme="dark"]` 로 켠다.
5. Vite 소비자는 `@tailwindcss/vite` 플러그인이 있어야 `@import`/`@theme`/`@utility`/`@source` 가 처리된다.

## 소비자가 자기 이름을 쓰고 싶을 때 — 별칭 레이어

토큰 이름을 바꾸는 비용이 큰 소비자(인라인 `style` 의 `var(--*)` 참조가 많은 앱)는
자기 이름을 정본에 잇는 별칭 블록만 두고 값은 정본에서 받는다. 선례: `axhub-axdiag`
`apps/admin` (참조 770줄을 한 줄도 고치지 않고 값만 정본으로 옮겼다).

**규칙**: 별칭의 오른쪽에는 `var(...)` 만 온다. 앱이 색 값을 만들면 정본이 둘이 된다.

**함정 1 — 자기 참조.** 정본과 **이름이 겹치는** 토큰을 별칭에 쓰면 `--danger: var(--danger)`
가 되어 값이 무효가 된다. axdiag 의 경우 정본과의 이름 교집합이 18개였다. 겹치는 이름은
별칭에서 빼고 정본 정의를 상속한다.

**함정 2 — 덮어쓰기.** 소비자의 `:root` 는 보통 unlayered 라 정본/HeroUI 의 `@layer` 정의를
**이긴다.** 자기 참조가 아니어도, 이름이 겹치면 정본이 칠하는 `card`·`chip`·`button`·`input`
렌더가 바뀐다. 겹치는 이름마다 "의도인가"를 판정해 문서로 남기게 안내해야 한다. (axdiag 의
`--surface`·`--border`·`--accent-soft-foreground`·`--accent` 4개는 실측 결과 전부 "정본이
HeroUI 를 이긴 지점을 올바르게 따라간 것"으로 판정됐다 — 근거는 axdiag admin 저장소의
`docs/design-system-adoption.md` 참조.)

## 알려진 공백 (2026-09 · 소비자 2개 기준)

1. **`--color-gray-200` / `--color-gray-300` / `--color-gray-400` 이 없다. (가장 큰 공백)**
   `@theme` 의 gray 는 50·100·500·600·700·800·850·900·950 뿐이다. 그런데 이 패키지 자신이
   `--border-default: var(--color-gray-200)` · `--border-strong: var(--color-gray-300)` ·
   `--fg-subtle: var(--color-gray-400)` · `--fg-disabled: var(--color-gray-300)` ·
   `--bg-emphasis: var(--color-gray-200)` 로 그 셋을 참조하므로(`dist/styles/index.css:17-25`
   에 정의 없음, 151·158-166줄에서 참조), Tailwind 가 **자기 기본 팔레트 값을 emit** 한다.
   소비자는 정본 값과 Tailwind 기본값이 섞인 **혼종 계단**을 쓰게 된다.

   두 방향에서 확인했다.

   **정적 대조** — 정본 `dist/styles/index.css:17-25` 와 `tailwindcss@4.3.3/theme.css` 를
   직접 읽어 계단 전체를 계산(2026-09-06 재측정):

   | 단계 | ΔL(%p) | C | H | 출처 |
   |---|---|---|---|---|
   | 50→100 | 1.5 | 0.003 | 264.5 | 정본 |
   | 100→200 | 4.4 | 0.006 | 264.5 | Tailwind 기본 |
   | 200→300 | 5.6 | 0.010 | 258.3 | Tailwind 기본 |
   | **300→400** | **16.5** | 0.022 | 261.3 | Tailwind 기본 |
   | **400→500** | **15.7** | 0.021 | 272.1 | 정본 |
   | 500→600 | 10.8 | 0.017 | 268.3 | 정본 |
   | 600→700 | 7.4 | 0.014 | 269.3 | 정본 |
   | 700→800 | 9.5 | 0.011 | 271.0 | 정본 |
   | 800→850 | 3.7 | 0.010 | 276.7 | 정본 |
   | 850→900 | 3.1 | 0.008 | 274.5 | 정본 |
   | 900→950 | 7.5 | 0.005 | 285.7 | 정본 |

   정본이 스스로 정의한 구간의 최대 계단은 **10.8%p** 인데, 혼종 구간의 두 경계가
   16.5·15.7 로 그 1.5배다. 색상각도도 정본 구간에서는 264.5 → 285.7 로 단조 증가하는데
   Tailwind 구간에서 **258.3 으로 역행**했다가 되돌아온다.

   **브라우저 실측** — axhub 심사 큐 화면에서 잰 `--fg-disabled` 의 라이트 계산값
   `oklch(0.872 0.01 258.338)` 이 **Tailwind 기본 gray-300 과 정확히 일치**한다. 즉 정본의
   시맨틱 토큰이 정본 값이 아니라 Tailwind 기본값으로 해석되고 있다.

   정본의 `--color-gray-850` 은 대부분의 소비자 계단에 대응이 없어 버려진다.

   **조치**: 200/300/400 을 이 패키지가 스스로 정의한다. 계단 전체를 한 벌로 소유하지 않으면
   소비자는 자기도 모르게 두 팔레트를 섞는다. (후속 작업 — 별도 PR. 이 PR 범위 밖이다.)
2. `--color-gray-*` 계단에 다크 분기가 없다. 회색을 배경/전경으로 직접 쓰는 소비자는
   다크에서 값이 안 바뀐다. 시맨틱 토큰(`--bg-*`/`--fg-*`)을 쓰라고 안내해야 한다.
3. `table` · `avatar` · `breadcrumbs` 어휘가 없다. axdiag `apps/admin` 이 자체 정의해 쓴다.
   구버전(2.7.4)에도 4.0.0 에도 없었다 — 이번 업그레이드로 새로 깨지거나 새로 고쳐진 것이
   아니다. **정본은 이것들을 새로 넣지 않기로 판정했다.** 소비자가 하나뿐인 컴포넌트를
   정본에 올리면 패키지가 그 제품의 거울이 될 뿐이다(`List`·`SkeletonRow` 가 이미 axhub 에서
   소비자 0인 채로 올라가 있는 전례). 두 번째 제품이 같은 것을 필요로 할 때 올린다.
4. `List`·`SkeletonRow` 는 소비자가 0이다. 다음 major 에서 제거를 검토한다.
