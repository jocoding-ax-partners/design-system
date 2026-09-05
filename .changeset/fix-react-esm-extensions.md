---
"@jocoding-ax-partners/react": patch
---

Fix ESM resolution so Node consumers can import this package at all.

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
