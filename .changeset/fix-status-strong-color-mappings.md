---
"@jocoding-ax-partners/design-system": patch
---

Map the status `-strong` tokens into the `--color-*` namespace so Tailwind
generates `bg-*`/`text-*` utilities for them. Without this, `StatusDot`'s
active/failed/warning tones rendered with no color for every consumer.
