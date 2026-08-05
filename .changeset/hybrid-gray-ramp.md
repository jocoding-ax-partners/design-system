---
"@demodev-ui/react": patch
---

- Partially revert the switch to Tailwind's gray palette shipped in 2.4.1. The scale is now a hybrid: `gray-50`–`gray-400` stay on Tailwind's defaults, `gray-500`–`gray-950` go back to the custom values.
  - The restored dark steps hold chroma low so dark grays stay neutral instead of drifting blue. Tailwind's own ramp climbs to C 0.034 at `gray-900`; these settle at C 0.008.
  - Steps 50–400 keep Tailwind's values because the two ramps were already within ΔEok 0.01 there, below the perceptual threshold, so overriding them bought nothing.
  - `gray-950` is now defined (`#070709`) so the chroma decay continues to the end of the ramp instead of jumping back to Tailwind's blue-black.
  - `--border` and `--default` still resolve to Tailwind's `gray-200` / `gray-100`. `--muted` goes back to the custom `#6d717e`.
