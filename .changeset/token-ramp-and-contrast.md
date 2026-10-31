---
"@jocoding-ax-partners/design-system": major
---

Own the full gray ramp and make every paired foreground/background clear WCAG AA.

- `--color-gray-200/300/400` are now defined here (Tailwind's lightness steps on this ramp's hue). Before, they leaked from Tailwind's default palette and the hue ran backwards.
- Light `--danger-strong`, `--success-strong` and `--warning-strong` now point at the 700 steps (5.0–5.7:1 on #fff). They used to equal the base color (1.97–4.40:1).
- Light `*-soft-foreground` use the 800 steps (accent: accent-700; info: `--info-strong`), so text on `-soft` fills clears AA (was 1.82–3.97:1).
- `--color-danger-500` (the light `--danger` base) is `#e60f24` instead of `#ef1026`, so a white label on a filled danger reads 4.59:1.
- Dark: `--primary` fills with `--primary-base` (white label 4.87:1, was 3.77:1) and hovers to `accent-700`; `--danger-strong` is `#ff6b7a` (5.43:1 on `--bg-surface`); `--danger-foreground` is dark (5.31:1 on the dark danger fill).
- `--fg-subtle` is documented as the non-text floor (3.1:1, icons and placeholders); readable secondary text uses `--fg-muted`.

Visual change: status text, soft badges, filled danger and dark primary fills render darker or with a dark label. Review consumers that hard-coded the old colors next to these tokens.
