# @jocoding-ax-partners/tailwind

## 0.1.0

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
