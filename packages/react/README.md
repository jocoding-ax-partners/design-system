# @jocoding-ax-partners/react

Shared React components — `CodeBlock`, `ConfirmProvider`/`useConfirm`, `HoverReadout`,
`Input`, `List`, `Pagination`, `SearchBox`, `SidePanel`, `Skeleton`, `StatCard`,
`StatusDot`, `NavItem`, `NavList`, `Sidebar`, `TopBar`, `AppHeader`, `Breadcrumbs`, `PageHeader`,
`PageContainer`, `TabNav`, `KpiStatBar`, `KpiSearchButton` — plus a `cn` helper, for
cases `@heroui/react` has no equivalent for. All but `Breadcrumbs` are promoted from
axhub-frontend.

`NavItem`, `NavList`, `Sidebar`, `TopBar`, `PageHeader`, `PageContainer`, and `TabNav`
are AxHub's navigation shell, canonicalized — same class strings and same markup as the
components they were promoted from.

`Breadcrumbs` is **new in this package, not a promotion**: axhub-frontend has no
breadcrumb component. It replaces the hand-rolled `.breadcrumbs` BEM block APTA was
carrying and is built from the same design tokens as the components above.

All of them take no dependency on any router — a consumer injects its own `Link` via a
`renderLink` prop — and enforce accessibility through their API shape rather than
convention: `NavItem` throws if given neither `href` nor `onSelect`, so a
non-interactive `<div onClick>` nav item can't be built with it.

## Install

```bash
npm install @jocoding-ax-partners/react @heroui/react@^3 @phosphor-icons/react@^2 react@^19 react-dom@^19
```

## Required setup: add a Tailwind `@source`

These components are styled with Tailwind utility classes in their source, not
precompiled CSS. Tailwind v4 generates a utility only if it finds that exact
class name in a file it scans — and **Tailwind does not scan `node_modules` by
default**. Without telling it to, classes like `h-1.5`, `bg-success-strong`,
`text-[12px]`, and `tracking-[0.04em]` are silently dropped, and every
component in this package renders unstyled (e.g. `StatusDot`'s dot collapses
to `0×0`, `CodeBlock` renders as unstyled black text).

Add this line to your Tailwind CSS entry file, alongside `@import "tailwindcss"`:

```css
@source "../node_modules/@jocoding-ax-partners/react/dist";
```

The path must point at this package's install location under `node_modules`
(adjust the leading `../` segments to match your CSS file's location) — that
is the directory Tailwind would otherwise skip.

## Usage

```tsx
import { StatusDot } from "@jocoding-ax-partners/react";

<StatusDot tone="active">Active</StatusDot>;
```

## App header (GNB) and account menu

`AppHeader` is the full-width product header shared by APTA and AxLMS. It wraps
`TopBar`: the logo and the top menu go in `leading`, the `trailing` slot (notification
bell, theme toggle) and the account button go in `actions`.

```tsx
import { AppHeader } from "@jocoding-ax-partners/react";

<AppHeader
  logo={<Logo />}
  nav={[
    { label: "Dashboard", href: "/", active: true },
    { label: "Help", href: "/help" },
  ]}
  user={{ name: "Sky Kim", email: "sky@acme.com" }}
  accountItems={[
    { label: "Account settings", href: "https://acme.axhub.ai/settings/profile", external: true },
    ...(canAdmin ? [{ label: "Admin", href: "/manage" }] : []),
  ]}
  onLogout={hubLogout}
  renderLink={(props) => <Link to={props.href} {...props} />}
  trailing={<ThemeToggle />}
/>;
```

- **No permission checks.** The app decides which `accountItems` to pass; the header
  renders them as given, followed by a logout item that is always present.
- `external` items open in a new window (`target="_blank"`, `rel="noreferrer"`) —
  `NavLinkRenderProps` now carries optional `target`/`rel`, so a custom `renderLink`
  must forward them.
- If `onLogout` returns a Promise, the logout item is disabled while it is pending and
  a one-line error is shown inside the menu if it rejects.
- The account menu is a popover from `md` up and a bottom sheet below `md`. Keyboard
  follows the WAI-ARIA menu button pattern (Enter/Space/↓ open on the first item, ↑ on
  the last, ↑/↓/Home/End move, Esc closes and returns focus, Tab closes).
- Height reads the app's `--gnb-h` variable and falls back to `--topbar-height`; the
  package adds no new token. The top menu is hidden below `md`.

## Optional ag-grid shell

Install the Community packages only when the app renders data grids:

```bash
npm install ag-grid-community@^36.1.0 ag-grid-react@^36.1.0
```

Import from the dedicated subpath so root-package consumers do not load ag-grid:

```tsx
import { AgDataGrid, useGridColumnState } from "@jocoding-ax-partners/react/ag-grid";

const gridState = useGridColumnState("members-grid.ag");
<AgDataGrid isDark={theme === "dark"} columnDefs={columns} rowData={rows} {...gridState} />;
```

`isDark` is explicit because the package does not own the consumer's theme store.
