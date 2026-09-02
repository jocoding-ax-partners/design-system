---
"@jocoding-ax-partners/design-system": patch
---

Ship the `--primary-*` token family from the canon. `List` and `SidePanel` were
promoted referencing `var(--primary)`, which no stylesheet declared — their
active indicator and resize handle rendered with no color for every consumer.
