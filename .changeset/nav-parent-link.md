---
"@jocoding-ax-partners/react": minor
---

`NavList` entries with children gain two opt-in props. `parentLink` keeps the parent row as an `href` link and moves expanding to a separate caret button (name from `toggleLabel`, default `{label} 하위 메뉴`), for a menu whose parent has its own page. `expandWhenActive` opens the entry the moment a child becomes active, such as after a route change or deep link; a person can still collapse it. Without these props the row stays one accordion button, as before.
