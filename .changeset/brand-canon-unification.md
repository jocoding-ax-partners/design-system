---
"@jocoding-ax-partners/design-system": minor
---

Own the pieces every JoCoding AX Partners product was rebuilding locally, so the console, admin and axclass can render from one canon.

- `--font-sans` / `--font-mono`: the Pretendard Variable stack. Font files are not shipped — self-host `pretendard` in the app.
- `--color-primary-50` … `--color-primary-950`: aliases of the accent ramp (`bg-primary-100` = `bg-accent-100`).
- Tenant brand: `<html data-brand-theme style="--primary: …">` derives the whole primary set (hover, soft, gradient) and the accent ramp HeroUI reads from one color, in light and dark. `data-home-theme` is accepted as a legacy alias.
- `--chart-1` … `--chart-8`, `--chart-other`: categorical series colors for light and dark, exposed as `bg-chart-*` / `text-chart-*`.
- Motion: `--duration-fast|base|slow` custom properties and `ease-standard`. `--ease-out` now replaces Tailwind's default curve with `cubic-bezier(0.16, 1, 0.3, 1)`.

Visual change: consumers that never set a font now render Pretendard (or the system fallback when it is not loaded), and `ease-out` transitions use the new curve.
