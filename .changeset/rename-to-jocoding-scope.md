---
"@jocoding-ax-partners/design-system": major
---

Rename the package from `@demodev-ui/react` to `@jocoding-ax-partners/design-system`.

The old name described the implementation language rather than the artifact: the package
ships no React code at all, only CSS that restyles HeroUI components and registers the
design tokens. The new name states what consumers actually install.

To migrate, replace the dependency and the single stylesheet import:

```diff
-npm install @demodev-ui/react
+npm install @jocoding-ax-partners/design-system
```

```diff
-@import "@demodev-ui/react/styles";
+@import "@jocoding-ax-partners/design-system/styles";
```

Nothing else changes — the exported stylesheet, the design tokens, the `data-*`
extensions and the `@heroui/react` peer dependency are all identical to 2.7.4.
`@demodev-ui/react` receives no further releases.
