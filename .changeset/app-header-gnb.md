---
"@jocoding-ax-partners/react": minor
---

Add `AppHeader`, the shared full-width product header (GNB) with an account menu. It wraps `TopBar` with a logo, a top menu, a `trailing` slot and an account button whose menu renders app-provided items (account settings in a new window, an optional surface switch) plus logout. It makes no permission decisions, opens as a popover from `md` up and as a bottom sheet below, and follows the WAI-ARIA menu button keyboard pattern. Height reads the app's `--gnb-h` and falls back to `--topbar-height`. `NavLinkRenderProps` gains optional `target` and `rel` fields.
