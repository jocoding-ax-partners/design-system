---
"@jocoding-ax-partners/design-system": patch
---

Ship the `--syntax-*` code-highlight palette. `CodeBlock` was promoted without
it, so every token in a highlighted snippet resolved to the inherited color —
syntax highlighting was dead for every consumer.
