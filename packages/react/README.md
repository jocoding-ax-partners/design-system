# @jocoding-ax-partners/react

Eleven React components — `CodeBlock`, `ConfirmProvider`/`useConfirm`, `HoverReadout`,
`Input`, `List`, `Pagination`, `SearchBox`, `SidePanel`, `Skeleton`, `StatCard`,
`StatusDot` — plus a `cn` helper, promoted verbatim from axhub-frontend for cases
`@heroui/react` has no equivalent for.

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
