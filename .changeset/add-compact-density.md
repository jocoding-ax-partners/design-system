---
"@jocoding-ax-partners/design-system": minor
---

Add a compact density scope, opted into with `<html data-density="compact">`.
It steps down the reading type sizes, row height and container padding, and
deliberately leaves control heights alone — 40px is already the floor for a
touch target. Measurements come from apex-expert's hand-built dense backoffice.

Nothing changes at the default density: the scope only adds rules, and the one
place a token could not reach (`button-size-sm`, which pins `text-xs`) is
restated inside the scope rather than tokenized.
