---
"@jocoding-ax-partners/design-system": major
---

Map surface, foreground and border tokens onto Tailwind's role-scoped theme
keys (`--background-color-*`, `--text-color-*`, `--border-color-*`) instead of
the generic `--color-*` namespace, matching the canon.

Before this, `bg-surface` picked up HeroUI's `--surface`, `bg-muted` painted the
*foreground* muted color, `bg-content`/`bg-emphasis`/`bg-inverse` generated no
utility at all, and `border-default` painted the text color. The generic mapping
also shadowed HeroUI's own `--color-default`, turning secondary select and
autocomplete pressed states near-black.

Utilities that changed: `bg-surface`, `bg-muted`, `border-default`,
`border-strong`, `border-interactive`, `border-divider` (corrected values);
`bg-content`, `bg-emphasis`, `bg-inverse` (now generated). The unused
`bg-bg-*` / `text-bg-*` forms are gone.
