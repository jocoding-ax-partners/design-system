---
"@demodev-ui/react": minor
---

- Add an 11-step `accent` scale (`--color-accent-50`–`--color-accent-950`), so utilities like `bg-accent-600`, `text-accent-700` and `border-accent-200` are now available.
  - The brand `#2d64fa` is pinned at **600, not 500**. Its lightness (L 56.3) sits on Tailwind's 600 slot — `blue-600` is L 54.6, `blue-500` is L 62.3 — which is where solid action colors normally live. Anchoring it at 500 would have shifted the whole ramp a step lighter.
  - `--accent` now resolves to `var(--color-accent-600)` instead of a literal, giving the brand one source of truth. The rendered color is unchanged.
  - Lightness is evenly spaced: ΔL 74 per step above 600, 81 below. Hue rises monotonically from 262° to 267.5°, because below the sRGB blue cusp (L 0.45) the violet side carries far more chroma than the cyan side — 0.274 vs 0.206 at L 0.40. Chroma peaks at 700 and every step stays inside sRGB.
  - The `--accent-soft` tokens are unchanged. They rely on `color-mix` with `transparent`, which dark mode redefines at 12%, so an opaque scale step cannot replace them.
