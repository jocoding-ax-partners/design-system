---
"@jocoding-ax-partners/react": minor
---

Promote the rest of the console shell so every product draws the same sidebar, rail, top bar and card.

- `Card` (`padding: "md" | "none"`, `as`) and `CardEmpty`, plus the class strings `cardClass`, `cardFlushClass`, `cardEmptyClass` and `canvasClass` for places that cannot take a component. Values are the console's `consoleCard.ts`: radius 12, padding 16, `border-default`, on the new `bg-canvas` floor.
- `Rail`, `RailTile`, `RailTileContent` and `railTileClass`: the floating 52px tile rail from the console's member screens, with a `footer` slot under a separator and `renderLink` for any router.
- `TopBar` gains `surface` (`default`, `transparent`, `content`), the console's transparent and filled top bar states, and `railBreakpoint` (`md` | `lg`) for shells whose rail shows from `md`.
- `NavItem` text is now 15px and `PageContainer` is 1600px wide with `pt-5 md:pt-10`, matching the console again.
