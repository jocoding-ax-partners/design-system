---
"@jocoding-ax-partners/react": patch
---

Document the Tailwind `@source` a consumer must add for this package's
components to render styled. Tailwind v4 does not scan `node_modules` by
default, so without an explicit `@source` pointing at this package's install
location, every component ships unstyled. Adds the requirement, with the
literal line to copy, to this package's README and the repo README's package
table; also fixes the same gap in the Storybook app used to review these
components.
