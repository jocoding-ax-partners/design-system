# design-system

A CSS-only design system built on [HeroUI v3](https://v3.heroui.com), published as
[`@jocoding-ax-partners/design-system`](./packages/heroui).

Most consumers import components from `@heroui/react` and add a single stylesheet, which
restyles those components and registers the design tokens — everything else in this repo
is CSS. `packages/react` is the one exception: eleven React components (plus a `cn`
helper) promoted verbatim from axhub-frontend that don't have a HeroUI equivalent.

## Packages

| Path                | Package                               | Published | What it is                                                                                            |
| ------------------- | ------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `packages/tailwind` | `@jocoding-ax-partners/tailwind`       | no        | Design tokens — colors, radius, spacing, typography — plus shared Tailwind utilities                     |
| `packages/heroui`   | `@jocoding-ax-partners/design-system`  | npm       | HeroUI component overrides. Inlines `tailwind` at build time and is the only artifact consumers install |
| `packages/react`    | `@jocoding-ax-partners/react`          | no        | React components with no HeroUI equivalent — `CodeBlock`, `ConfirmDialog`, `HoverReadout`, `Input`, `List`, `Pagination`, `SearchBox`, `SidePanel`, `Skeleton`, `StatCard`, `StatusDot` — plus a `cn` helper |
| `apps/storybook`    | —                                      | no        | Storybook used to develop and review the overrides against real HeroUI components                       |

`apps/storybook/src/stories` mirrors upstream HeroUI stories; `stories-extended` covers
the things this system adds or changes.

## Getting started

Requires Node 24+ and pnpm.

```bash
pnpm install
pnpm storybook        # http://localhost:6006
```

## Scripts

| Command                       | Does                                                                |
| ----------------------------- | ------------------------------------------------------------------- |
| `pnpm storybook` / `pnpm dev` | Run Storybook on http://localhost:6006 — the main development loop   |
| `pnpm build`                  | Build `packages/heroui` (→ `dist/styles`) and the static Storybook    |
| `pnpm build-storybook`        | Build the static Storybook only                                      |
| `pnpm check-types`            | `tsc -b` over `apps/storybook`                                       |
| `pnpm lint`                   | ESLint — `apps/storybook` is the only package with a `lint` script   |
| `pnpm format`                 | Prettier over `ts`, `tsx` and `md`                                   |
| `pnpm extract-stories`        | Regenerate `apps/storybook/src/stories` from HeroUI                  |

## How the build works

`packages/heroui` is compiled with PostCSS: `src/styles/index.css` → `dist/styles/index.css`.
`@jocoding-ax-partners/tailwind/styles` and the local CSS are inlined, while `@import "@heroui/styles"`
is preserved so HeroUI's sheet still resolves from the consumer's own install.

The published artifact is Tailwind v4 **source**, not finished CSS — consumers run
Tailwind themselves, which is what lets them use tokens like `rounded-button-md` in
their own markup.

## Releasing

Releases run through GitHub Actions. Write a changeset with your change and the
rest is automatic:

```bash
pnpm changeset            # describe the change (in English — it ships to npm)
```

Commit the generated `.changeset/*.md` with your PR. When the PR merges to
`main`, the Release workflow opens a "Version Packages" PR that bumps versions
and updates changelogs. Merging *that* PR publishes to npm and pushes annotated
tags.

**One-time setup:** the workflow needs an `NPM_TOKEN` repository secret with
publish rights on the `@jocoding-ax-partners` scope
(Settings → Secrets and variables → Actions).

The manual path is still available if the workflow is down — see
[`CLAUDE.md`](./CLAUDE.md) for the full checklist, including the annotated-tag
requirement that `--follow-tags` silently skips.

## Consuming the system

See [`packages/heroui/README.md`](./packages/heroui/README.md) for install and setup, and
[`packages/heroui/llms.txt`](./packages/heroui/llms.txt) for the agent-facing reference to
the `data-*` extensions and design tokens.

새 제품에 이 패키지를 붙일 때는 [docs/consumers.md](docs/consumers.md) 의 배선 체크리스트를 따른다.

### `@jocoding-ax-partners/react` needs a Tailwind `@source`

Unlike `packages/heroui`, `packages/react` ships components styled with Tailwind
utility classes (`h-1.5`, `bg-success-strong`, `text-[12px]`, …) rather than
precompiled CSS. Tailwind v4 only generates a utility if it finds the class
literally in a file it scans, and it does not scan `node_modules` by default —
so without an explicit `@source`, every component in this package renders
unstyled for consumers. Add this line to your Tailwind CSS entry file, next to
the `@import "tailwindcss"` line:

```css
@source "../node_modules/@jocoding-ax-partners/react/dist";
```

Adjust the leading `../` segments to the actual relative path from your CSS
file to `node_modules`. See [`packages/react/README.md`](./packages/react/README.md)
for details.
