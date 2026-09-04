# @jocoding-ax-partners/react

## 0.1.0

### Minor Changes

- a949926: Add the React package. It ships the composition-level components that the CSS
  layer cannot express — the ones every consumer would otherwise rebuild. Starts
  with SkeletonRow, StatCard and StatusDot.
- ab192a1: Add List, CodeBlock, HoverReadout, Input, SearchBox, Pagination, ConfirmProvider/useConfirm
  and SidePanel, completing the set of domain-agnostic components carried up from
  axhub-frontend.

### Patch Changes

- 58e6194: Document the Tailwind `@source` a consumer must add for this package's
  components to render styled. Tailwind v4 does not scan `node_modules` by
  default, so without an explicit `@source` pointing at this package's install
  location, every component ships unstyled. Adds the requirement, with the
  literal line to copy, to this package's README and the repo README's package
  table; also fixes the same gap in the Storybook app used to review these
  components.
- Updated dependencies [2f32086]
- Updated dependencies [4d050a0]
- Updated dependencies [eed00db]
- Updated dependencies [c48bf94]
- Updated dependencies [17bf42b]
- Updated dependencies [9851420]
- Updated dependencies [9ed9fd9]
- Updated dependencies [06cafa3]
- Updated dependencies [4dcd8d5]
- Updated dependencies [f92fbbc]
  - @jocoding-ax-partners/design-system@4.0.0
