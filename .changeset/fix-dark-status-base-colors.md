---
"@jocoding-ax-partners/design-system": patch
---

Fix status colors inheriting their light values in dark mode. The dark block
redefined only the `soft` steps, so base colors like `--success` stayed at
`#1fa24e` on a dark canvas.
