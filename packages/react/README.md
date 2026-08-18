# @demodev-ui/react

CSS-only design system built on [HeroUI v3](https://v3.heroui.com).

**This package exports no components.** You import components from `@heroui/react` as
usual; this package ships a single stylesheet that restyles them and registers a set of
design tokens. There is no provider, no wrapper, and no JavaScript.

## Install

```bash
npm install @demodev-ui/react @heroui/react@^3 @heroui/styles@^3 tailwindcss@^4
```

## Setup

Add one import to your Tailwind CSS entry file:

```css
@import "tailwindcss";
@import "@demodev-ui/react/styles";
```

That is the whole setup. `@demodev-ui/react/styles` imports `@heroui/styles` itself, so
you do not import it separately — but it stays a peer dependency and must be installed.
Place the import after `tailwindcss` and after any stylesheet it should override.

Tailwind v4 for your framework is upstream setup — see the
[Tailwind installation guide](https://tailwindcss.com/docs/installation). Same for
HeroUI's own [requirements and quick start](https://v3.heroui.com/docs/react/getting-started/quick-start).

```tsx
import { Button } from "@heroui/react"; // ✅
import { Button } from "@demodev-ui/react"; // ❌ does not exist
```

## What this package adds

### `data-*` attributes

HeroUI's prop types cannot be extended, so the extra options ride on data attributes.

| Component                       | Attribute      | Values                                          |
| ------------------------------- | -------------- | ----------------------------------------------- |
| `Button` (outline, ghost)       | `data-color`   | `accent` `danger` `success` `warning` `info`    |
| `ToggleButton` (default, ghost) | `data-color`   | `accent` `danger` `success` `warning` `info`    |
| `Chip`                          | `data-color`   | `info`                                          |
| `Checkbox.Control`              | `data-size`    | `md`                                            |
| `Checkbox.Control`              | `data-rounded` | `"true"`                                        |
| `Radio.Control`                 | `data-size`    | `md`                                            |

```tsx
<Button variant="outline" data-color="danger">Delete</Button>
```

### ListBox selection

Inside `Select`, `ComboBox`, `Autocomplete` and standalone `ListBox`, the item indicator
is hidden and a selected item is marked by an accent background instead.

```tsx
<ListBox.Item id="florida" textValue="Florida">
  Florida
  <ListBox.ItemIndicator /> {/* opts this item into the accent background */}
</ListBox.Item>
```

Rendering the indicator is what opts an item into that styling. An item without one
keeps HeroUI's appearance, where selection is not marked at all.

### Tailwind utilities

Registered on top of stock Tailwind and HeroUI:

- **Colors** — `accent-50`…`accent-950`, `gray-850`, and an `info` family
  (`info`, `info-soft`, `info-soft-foreground`, …) that HeroUI does not ship
- **Radius** — `rounded-button-xs|sm|md|lg`, `rounded-input`, `rounded-list-box`,
  `rounded-toast`, `rounded-dialog`, `rounded-card`, …
- **Spacing** — `h-button-sm|md|lg`, `size-input`, `gap-field`, …
- **Typography** — `text-display-01`…`04`, `text-heading-01`…`05`, `text-body-01`…`03`,
  `text-caption-01|02`
- **Variant** — `light:`, the counterpart to HeroUI's `dark:`

Parts of HeroUI's own palette are also re-valued without adding a utility name — the
gray scale is shifted to neutral oklch, and a number of semantic, surface and field
roles are overridden. Keep using HeroUI's utility names for those.

Exact values live in the shipped stylesheet
(`node_modules/@demodev-ui/react/dist/styles/index.css`). They are deliberately not
duplicated here, because a copy drifts from the source.

## Component documentation

This package does not document HeroUI's components — that is HeroUI's to maintain, and
a copy here would go stale on every release. Use, in order:

1. The HeroUI MCP server (`@heroui/react-mcp`) —
   [setup](https://v3.heroui.com/docs/react/getting-started/mcp-server)
2. [v3.heroui.com/docs/react/components](https://v3.heroui.com/docs/react/components)
3. `node_modules/@heroui/react/dist/components/<name>/<name>.d.ts` — the installed
   version, which wins when the docs disagree with runtime behavior

## Using with a coding agent

`llms.txt` ships inside the package and is the agent-facing reference for everything
above. Point your agent at it once, e.g. in `CLAUDE.md`:

```markdown
## @demodev-ui/react

This project uses @demodev-ui/react, a CSS-only design system on HeroUI v3.
Import all components from `@heroui/react`, never from `@demodev-ui/react`.
Read `node_modules/@demodev-ui/react/llms.txt` before writing UI code — it lists
the `data-*` extensions and design tokens this project adds on top of HeroUI.
```

## License

MIT
