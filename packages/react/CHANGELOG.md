# @jocoding-ax-partners/react

## 2.1.0

### Minor Changes

- 01e26f3: Promote the canonical KPI bar and add the canonical ag-grid shell through an optional lazy subpath.

## 2.0.0

### Minor Changes

- 0763f1f: Navigation and page-shell components, promoted from axhub-frontend.

  Seven of the eight components below are promotions of an existing axhub-frontend
  component — same class strings, same markup. `Breadcrumbs` is the exception and is
  described separately.
  - `NavItem` · `NavList` · `Sidebar` — the sidebar. Accessibility is enforced by the
    API shape: these render only `<a>` or `<button>`, and throw when given neither
    `href` nor `onSelect`, so a `<div onClick>` nav item cannot be expressed.
    Canon: `layout/InnerSidebar.tsx`, `layout/AppLayout.tsx:134`.
  - `TopBar` — the 60px top chrome (`--topbar-height`). Canon: `layout/Topbar.tsx`.
  - `PageHeader` · `PageContainer` · `TabNav` — the page shell. `PageContainer` is the
    single owner of outer page padding. `TabNav` ships `role="tablist"` / `role="tab"` /
    `aria-selected`. Canon: `shared/PageHeader.tsx`, `layout/PageContainer.tsx`,
    `tab-page/ui/TabNav.tsx`.
  - `Breadcrumbs` — **new in this package, not a promotion.** axhub-frontend has no
    breadcrumb component. It replaces the hand-rolled `.breadcrumbs` BEM block APTA was
    carrying, and is built out of the same design tokens as the components above. Its
    one invariant: the last crumb never renders as a link, even when given an `href`.
  - Router-independent: AxHub uses `react-router-dom` and APTA uses `react-router`, so
    the package imports neither. A consumer injects its own `Link` through `renderLink`.
  - Accessibility the canon does not have is added deliberately: a `focus-visible` ring
    on interactive rows, `aria-hidden` on decorative icons, `aria-expanded` on the
    accordion trigger, and `role="group"` + `aria-labelledby` on labelled sections.
    Where canon has no ring at all — `NavItem`, `PageHeader`'s back link, `Breadcrumbs` —
    the whole line is this package's invention, so it picks the ring color too:
    `ring-focus` (`var(--focus)`), which is what every focus ring in the shipped HeroUI
    bundle uses (measured: 47 `--tw-ring-color:var(--focus)` plus 2
    `outline-color:var(--focus)`, and zero `currentColor`). `TabNav` is the one component
    where canon already has a ring, and canon gives it no color; `TabNav` therefore keeps
    canon's colorless ring. See the deviation list below.
  - `@jocoding-ax-partners/tailwind` now owns the shell dimension and icon tokens:
    `--sidebar-width` (244px), `--topbar-height` (60px), and `--icon-inactive`
    (light `gray-300` / dark `gray-500`).
    `@jocoding-ax-partners/tailwind` is `private: true` and is never published — the only
    path these tokens take to a consumer app is the CSS shipped by
    `@jocoding-ax-partners/design-system` (`packages/heroui/src/styles/index.css` imports
    the tailwind theme and inlines it into dist). That is why this changeset also bumps
    `design-system`: without it, `h-[var(--topbar-height)]` stays undefined in the
    consumer and the header height collapses.
  - One icon set is enforced: `@phosphor-icons/react`. The eslint rule is an allowlist —
    it blocks any import whose package name contains "icon" and re-opens only Phosphor,
    plus an explicit entry for `lucide-react`, whose name does not. The previous
    five-name denylist let `@tabler/icons-react` and `feather-icons` through. The rule now
    lives at the repo root and applies to every package, including the storybook app.
  - The active nav item follows canon: **no background**, only weight and color change
    (`itemClass()`). The color arrives through `activeColor`, so a white-label tenant can
    supply its own.

  Deliberate deviations from canon, listed so they are not silently re-adjudicated:
  - `PageHeader`'s text column carries `min-w-0`; canon has a bare `flex-1`. Layout is
    identical at realistic title lengths and differs only for a title with no break
    opportunity (measured at 500px width: canon body 1151.9px, this 180px — the title
    shrinks inside the header instead of pushing it out). The consuming app measured this
    and accepted it.
  - `TopBar` renders its rail spacer only when `rail` is passed; canon always renders it.
    AxHub always passes one; APTA deliberately does not.
  - `Sidebar` adds `h-full` and a base-level `flex-col`. Canon needs neither because its
    column is `hidden` below `lg`, but a consumer that overrides `hidden` (APTA passes
    `className="flex"`) needs a direction on the base layer.
  - `TabNav`'s focus ring carries `ring-offset-background`, which canon does not have.
    This is the only deviation on the one component where canon specified a ring, and it
    is an **addition where canon was silent, not a change to something canon chose**:
    canon sets `ring-offset-2` but no offset _color_, so the Tailwind default applies —
    a hard-coded white, which reads as a halo on dark surfaces (measured, and the reason
    it was added). Canon's own decisions on that ring are followed exactly, including its
    decision to give the ring itself no color: `TabNav` does **not** get `ring-focus`.
    The rings on `NavItem`, `PageHeader` and `Breadcrumbs` are not deviations at all —
    canon has no ring on those, so nothing is being overridden. The accordion child rows
    get no ring: they keep canon's class string exactly and do not suppress the UA
    outline, so a focused child is still visible.

    Consequence, stated rather than buried: after this release `TabNav`'s ring follows
    `currentColor` while the other three follow `var(--focus)`. That is deliberate
    canon-fidelity, not an oversight. Making all four consistent is a design decision
    about a surface AxHub renders in production today, and it is left to a human.

  Version outcome: bumping `design-system` changes the `peerDependency` of `react`
  (`@jocoding-ax-partners/design-system: workspace:^`), so changesets promotes `react` to
  **major (1.0.0 → 2.0.0)**. That is intended — these components do not work without the
  new CSS (`h-[var(--topbar-height)]` becomes undefined and the header height collapses),
  and only a major tells a consumer the CSS has to move with it.

### Patch Changes

- Updated dependencies [0763f1f]
  - @jocoding-ax-partners/design-system@4.2.0

## 1.0.0

### Patch Changes

- Updated dependencies [ae1ed52]
  - @jocoding-ax-partners/design-system@4.1.0

## 0.1.2

### Patch Changes

- dde7a47: SearchBox 포커스 링을 1px 로 맞춘다.

  HeroUI `SearchField.Group` 의 기본 포커스 링은 2px 이고 링 폭 토큰이 없다
  (`heroui.min.css` 에 하드코딩). axhub-frontend 가 이 패키지로 이관하기 전
  로컬 래퍼에서 `focus-within:ring-1` 로 덮고 있던 값이라, 정본을 여기로 옮긴다.
  소비자는 래퍼 없이 패키지 컴포넌트를 그대로 쓸 수 있다.

## 0.1.1

### Patch Changes

- fc3ee20: Fix ESM resolution so Node consumers can import this package at all.

  The package is `"type": "module"`, but `dist/index.js` re-exported relative
  paths without file extensions (`export { cn } from "./lib/cn"`). Node's ESM
  loader requires explicit extensions on relative specifiers, so `import(...)`
  threw `ERR_MODULE_NOT_FOUND`. Vite and Playwright never noticed because a
  bundler resolves these statically; Vitest, Jest and Node SSR do not, and
  failed to load the package.

  Every relative specifier in `src` now carries its `.js` extension, which
  TypeScript resolves back to the `.ts` file and emits verbatim. A build step
  (`scripts/check-esm-extensions.mjs`) scans the emitted `dist` and fails if an
  extension-less relative specifier reappears, so the invariant is checked
  against the artifact that actually ships.

  `moduleResolution: "nodenext"` would let the compiler enforce this instead,
  but it also applies node16 resolution to our dependencies' shipped `.d.ts`
  files, and both `@heroui/react` and `@phosphor-icons/react` use extension-less
  specifiers there — which breaks type-checking for reasons outside this repo.

## 0.1.0

### Minor Changes

- a949926: Add the React package. It ships the composition-level components that the CSS
  layer cannot express — the ones every consumer would otherwise rebuild. Starts
  with SkeletonRow, StatCard and StatusDot.
- ab192a1: Add List, CodeBlock, HoverReadout, Input, SearchBox, Pagination, ConfirmProvider/useConfirm
  and SidePanel, completing the set of domain-agnostic components carried up from
  axhub-frontend.

### Patch Changes

- 58e6194: Document the Tailwind `@source` a consumer must add for this package's
  components to render styled. Tailwind v4 does not scan `node_modules` by
  default, so without an explicit `@source` pointing at this package's install
  location, every component ships unstyled. Adds the requirement, with the
  literal line to copy, to this package's README and the repo README's package
  table; also fixes the same gap in the Storybook app used to review these
  components.
- Updated dependencies [2f32086]
- Updated dependencies [4d050a0]
- Updated dependencies [eed00db]
- Updated dependencies [c48bf94]
- Updated dependencies [17bf42b]
- Updated dependencies [9851420]
- Updated dependencies [9ed9fd9]
- Updated dependencies [06cafa3]
- Updated dependencies [4dcd8d5]
- Updated dependencies [f92fbbc]
  - @jocoding-ax-partners/design-system@4.0.0
