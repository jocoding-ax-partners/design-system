# design-system

A CSS-only design system built on [HeroUI v3](https://v3.heroui.com), published as
[`@demodev-ui/react`](./packages/react).

The system ships no React components. Consumers import components from `@heroui/react`
and add a single stylesheet, which restyles those components and registers the design
tokens. Everything in this repo is CSS.

## Packages

| Path                | Package             | Published | What it is                                                                       |
| ------------------- | ------------------- | --------- | -------------------------------------------------------------------------------- |
| `packages/core`     | `@demodev-ui/core`  | no        | Design tokens — colors, radius, spacing, typography — plus shared Tailwind utilities |
| `packages/react`    | `@demodev-ui/react` | npm       | HeroUI component overrides. Inlines `core` at build time and is the only artifact consumers install |
| `apps/storybook`    | —                   | no        | Storybook used to develop and review the overrides against real HeroUI components |

`apps/storybook/src/stories` mirrors upstream HeroUI stories; `stories-extended` covers
the things this system adds or changes.

## Getting started

Requires Node 24+ and pnpm.

```bash
pnpm install
pnpm storybook        # http://localhost:6006
```

## Scripts

| Command                | Does                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| `pnpm storybook`       | Run Storybook on http://localhost:6006 — the main development loop       |
| `pnpm dev`             | Run the Storybook app's plain Vite dev server                            |
| `pnpm build-storybook` | Build the static Storybook                                               |
| `pnpm build`           | Build `packages/react` (→ `dist/styles`) and the Storybook app           |
| `pnpm lint`            | ESLint — only `apps/storybook` defines a `lint` script                    |
| `pnpm format`          | Prettier over `ts`, `tsx` and `md`                                       |
| `pnpm extract-stories` | Regenerate `apps/storybook/src/stories` from HeroUI                      |

## How the build works

`packages/react` is compiled with PostCSS: `src/styles/index.css` → `dist/styles/index.css`.
`@demodev-ui/core/styles` and the local CSS are inlined, while `@import "@heroui/styles"`
is preserved so HeroUI's sheet still resolves from the consumer's own install.

The published artifact is Tailwind v4 **source**, not finished CSS — consumers run
Tailwind themselves, which is what lets them use tokens like `rounded-button-md` in
their own markup.

## Releasing

Uses [changesets](https://github.com/changesets/changesets). See
[`CLAUDE.md`](./CLAUDE.md) for the full checklist, including the tag conventions.

```bash
pnpm changeset            # describe the change (in English — it ships to npm)
pnpm version-packages     # bump versions, update CHANGELOG
# commit, then tag — annotated, or --follow-tags will silently skip it:
#   git tag -a '@demodev-ui/react@<version>' -m '@demodev-ui/react@<version>'
git push --follow-tags
git ls-remote --tags origin   # confirm the tag actually reached the remote
pnpm release              # build + publish
```

## Consuming the system

See [`packages/react/README.md`](./packages/react/README.md) for install and setup, and
[`packages/react/llms.txt`](./packages/react/llms.txt) for the agent-facing reference to
the `data-*` extensions and design tokens.
