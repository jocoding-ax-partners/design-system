---
"@jocoding-ax-partners/react": minor
---

Add `AppHeader`, the shared full-width product header (GNB) with an account menu. It wraps `TopBar` with a logo, a top menu, a `trailing` slot and an account button whose menu renders app-provided items (account settings in a new window, an optional surface switch) plus logout. It makes no permission decisions, opens as a popover from `md` up and as a bottom sheet below, and follows the WAI-ARIA menu button keyboard pattern. Height reads the app's `--gnb-h` and falls back to `--topbar-height`. `NavLinkRenderProps` gains optional `target` and `rel` fields.

`AppHeader` also takes optional props so another product (AxLMS) can keep its own header behavior and surface: `accountButtonProps`/`accountMenuProps` (pass `data-*`/`aria-*` to the account button and menu), `accountMenuOpen`/`onAccountMenuOpenChange` (controlled account menu), `outsideClickIgnore` (a CSS selector whose clicks do not close the menu), `dataAttrs` (root `data-*`, e.g. `data-scrolled`), `classNames` (`inner` padding, `accountMenu` shadow, `accountRow` and `accountEmail` colors), nav item `badge`, `navActiveVariant` (`"bold"` default or `"soft"`), `navReserveBoldWidth`, `brandTag` and `leadingStart` (a slot before the logo). `TopBar` gains optional `innerClassName` and `dataAttrs`. Defaults are unchanged.
