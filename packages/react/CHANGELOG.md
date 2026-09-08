# @jocoding-ax-partners/react

## 1.0.0

### Patch Changes

- Updated dependencies [ae1ed52]
  - @jocoding-ax-partners/design-system@4.1.0

## 0.1.2

### Patch Changes

- dde7a47: SearchBox 포커스 링을 1px 로 맞춘다.

  HeroUI `SearchField.Group` 의 기본 포커스 링은 2px 이고 링 폭 토큰이 없다
  (`heroui.min.css` 에 하드코딩). axhub-frontend 가 이 패키지로 이관하기 전
  로컬 래퍼에서 `focus-within:ring-1` 로 덮고 있던 값이라, 정본을 여기로 옮긴다.
  소비자는 래퍼 없이 패키지 컴포넌트를 그대로 쓸 수 있다.

## 0.1.1

### Patch Changes

- fc3ee20: Fix ESM resolution so Node consumers can import this package at all.

  The package is `"type": "module"`, but `dist/index.js` re-exported relative
  paths without file extensions (`export { cn } from "./lib/cn"`). Node's ESM
  loader requires explicit extensions on relative specifiers, so `import(...)`
  threw `ERR_MODULE_NOT_FOUND`. Vite and Playwright never noticed because a
  bundler resolves these statically; Vitest, Jest and Node SSR do not, and
  failed to load the package.

  Every relative specifier in `src` now carries its `.js` extension, which
  TypeScript resolves back to the `.ts` file and emits verbatim. A build step
  (`scripts/check-esm-extensions.mjs`) scans the emitted `dist` and fails if an
  extension-less relative specifier reappears, so the invariant is checked
  against the artifact that actually ships.

  `moduleResolution: "nodenext"` would let the compiler enforce this instead,
  but it also applies node16 resolution to our dependencies' shipped `.d.ts`
  files, and both `@heroui/react` and `@phosphor-icons/react` use extension-less
  specifiers there — which breaks type-checking for reasons outside this repo.

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
