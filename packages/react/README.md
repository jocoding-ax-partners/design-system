# @jocoding-ax-partners/react

Shared React components — `CodeBlock`, `ConfirmProvider`/`useConfirm`, `HoverReadout`,
`Input`, `List`, `Pagination`, `SearchBox`, `SidePanel`, `Skeleton`, `StatCard`,
`StatusDot`, `NavItem`, `NavList`, `Sidebar`, `TopBar`, `Breadcrumbs`, `PageHeader`,
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
