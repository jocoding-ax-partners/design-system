# @demodev-ui/react

## 2.7.1

### Patch Changes

- Align field heights with buttons by drawing the outline inside the box

  HeroUI zeroes `--field-border-width`, so the 1px outline on primary fields sat
  outside the layout box. Fields rendered 2px taller and wider than their layout
  size, which made an Input or Select look larger than a Button beside it even
  though both resolve to the same 40px token.

  Fields now draw that outline on the inner edge, so visual size matches layout
  size. Input, Textarea, Select, Autocomplete, InputOTP and InputGroup all line up
  with Button. Focus is unchanged — HeroUI swaps the outline for a box-shadow ring
  on focus, which never affected layout.

## 2.7.0

### Minor Changes

- Raise the `@heroui/react` and `@heroui/styles` peer ranges to `^3.2.4`.

  `3.2.3` pins `tailwind-variants@3.3.0`, which leaks variants between component
  instances: on a re-render with unchanged props, a component can commit another
  instance's variant classes and never revert. `3.2.4` pins the fixed `3.3.1`, and
  `3.2.2` and below predate the regression, so `3.2.3` is the only affected release.

## 2.6.2

### Patch Changes

- - Collect the theme token overrides into named `theme-light` / `theme-dark` sets, so `:root` and any surface that deliberately inverts the page theme share one definition instead of drifting apart. Each set also restates the HeroUI originals an inverted surface cannot otherwise reach (pinned to `@heroui/styles` 3.2.4).
  - Base the `outline` border and the `ghost` foreground on `--button-fg` and the `*-soft-foreground` tokens, so both variants keep their contrast in dark mode instead of falling back to the raw brand color.
  - Invert the toast against the page theme, matching the tooltip, and keep the title neutral (`--overlay-foreground`) so the indicator icon is the only semantic color signal. Also drop the toast's own border and the action's vertical margin.
  - Switch the tooltip to the shared theme sets and give it an explicit `text-overlay-foreground` — HeroUI paints the body from `--overlay` but sets no text color.
  - Scope the close-button background override to the modal and alert-dialog close triggers, so close buttons elsewhere (toast) keep their own surface.

## 2.6.1

### Patch Changes

- - Align the toast indicator icon with the first line of the title. HeroUI vertically centers the content block while the indicator stays top-aligned, so the two drifted apart on multi-line toasts; the icon now sits on the title's line box.
  - Center the indicator and title vertically when a toast has no description, matching how the action is aligned.
  - Apply the `accent` indicator color to `.toast--accent` so it matches the title.
  - Apply the shared list-box popover surface to `.popover`, so bare popovers match the ones used by Select, ComboBox, Autocomplete and Dropdown.

## 2.6.0

### Minor Changes

- - Add extended `data-color` variants to toggle button: `default` renders a solid background, `ghost` renders a soft background with a matching border, so only the selected state is tinted
  - Add a `gray-850` step and convert the gray scale to oklch (round-trip verified, colors unchanged), and introduce dark-mode surface tokens (`--surface`, `--surface-secondary`, `--default`)
  - Align toggle button styling with regular buttons
  - Unify radius tokens: button group and toggle button group now match standalone buttons, tabs pill radius moved to the list container, card radius matches input, and list box item radius uses the shared token
  - Add a border and shadow to toast
  - Keep the tag remove button background transparent in every state
  - Remove the unused `chip-size-*` utilities along with the `--spacing-chip-*`, `--radius-chip-*`, and `--spacing-button-icon-sm` tokens

## 2.5.1

### Patch Changes

- Apply the `--radius-list-box-item` token to standalone ListBox items, which previously kept HeroUI's default radius — only popover-hosted list boxes (Select, ComboBox, Autocomplete, Dropdown) were covered before.

  Size horizontal tabs in the `secondary` variant to their own content instead of splitting the row evenly, so the underline hugs each label. Vertical tabs keep equal widths.

## 2.5.0

### Minor Changes

- Add styles for the date and calendar components, and restyle the tooltip.
  - `Calendar` / `RangeCalendar`: cell and nav-button radii now come from the new `--radius-calendar-*` tokens. The range track keeps a continuous look where a row or month boundary clips it, and rounds fully at the range caps.
  - `DateField`, `DatePicker`, `DateRangePicker`: the field box now matches `InputGroup` in height, inset and focus outline. The picker trigger and the popover surface align with the button and list-box popovers used elsewhere.
  - `Tooltip`: the surface is now inverted against the theme (dark surface in light mode, light surface in dark mode), and the arrow matches the shadcn size and rounded tip.

## 2.4.3

### Patch Changes

- d4144af: - Add an 11-step `accent` scale (`--color-accent-50`–`--color-accent-950`), so utilities like `bg-accent-600`, `text-accent-700` and `border-accent-200` are now available.
  - The brand `#2d64fa` is pinned at **600, not 500**. Its lightness (L 56.3) sits on Tailwind's 600 slot — `blue-600` is L 54.6, `blue-500` is L 62.3 — which is where solid action colors normally live. Anchoring it at 500 would have shifted the whole ramp a step lighter.
  - `--accent` now resolves to `var(--color-accent-600)` instead of a literal, giving the brand one source of truth. The rendered color is unchanged.
  - Lightness is evenly spaced: ΔL 74 per step above 600, 81 below. Hue rises monotonically from 262° to 267.5°, because below the sRGB blue cusp (L 0.45) the violet side carries far more chroma than the cyan side — 0.274 vs 0.206 at L 0.40. Chroma peaks at 700 and every step stays inside sRGB.
  - The `--accent-soft` tokens are unchanged. They rely on `color-mix` with `transparent`, which dark mode redefines at 12%, so an opaque scale step cannot replace them.
- - Restyle `Card`: the surface is now defined by a border instead of a shadow.
    - `shadow-none` on every variant, and a `border-border` outline on the `default` variant only. The other variants stay flat, so a card no longer floats above the page — it sits in it.
    - Radius moves to the new `--radius-card`, which resolves to `--radius-2xl` — the same curvature as `Dialog` and `Toast`. Surface-level elements now share one radius.
    - This is a visual change with no API change. If you relied on the old drop shadow, re-add it at the call site.

## 2.4.2

### Patch Changes

- - Partially revert the switch to Tailwind's gray palette shipped in 2.4.1. The scale is now a hybrid: `gray-50`–`gray-400` stay on Tailwind's defaults, while `gray-500` and darker are overridden again.
  - The restored dark steps hold chroma low so dark grays stay neutral instead of drifting blue. Tailwind's own ramp climbs to C 0.034 at `gray-900`; these settle at C 0.008.
  - Steps 50–400 keep Tailwind's values because the two ramps were already within ΔEok 0.01 there, below the perceptual threshold, so overriding them bought nothing.
  - `gray-950` is now defined (`#070709`) so the chroma decay continues to the end of the ramp instead of jumping back to Tailwind's blue-black.
  - `--border` and `--default` still resolve to Tailwind's `gray-200` / `gray-100`. `--muted` goes back to the custom `#6d717e`.

## 2.4.1

### Patch Changes

- - Use Tailwind's default gray palette instead of the custom gray scale
  - Fix dropdown menu items where the selection indicator overlapped the label
  - Chip: use semibold font weight and increase horizontal padding of the `sm` size to `1.5`
  - Split the warning soft foreground color into a dedicated `--warning-strong` token

## 2.4.0

### Minor Changes

- Add typography scale and refine component styles
  - Add Figma typography scale as `text-*` tokens
  - Add switch style overrides: the track is now twice the thumb diameter, with all sizes derived from the thumb variable
  - Unify the popover shell on `shadow-md` and apply it to dropdown as well
  - Change the button font weight to semibold
  - Change light mode `muted` to `gray-500`
  - Remove the focus ring from the autocomplete popover's search field and list items

## 2.3.0

### Minor Changes

- Add Autocomplete styles and refine the list-box popover surface.
  - **Autocomplete**: new overrides that bring it in line with Select and ComboBox — field metrics on the trigger, design-system radius on the popover, and a filter search field that matches the list items in height, radius and inset.
  - **Popover surface**: the Select, ComboBox and Autocomplete popovers now have a border, and their shadow casts downward only (HeroUI's upward layer is dropped). Dark mode keeps HeroUI's inset hairline.
  - **New theme tokens**: `--radius-input` (same value as `--radius-button-md`) and `--spacing-list-box-item`.

## 2.2.1

### Patch Changes

- Add an `info` color to `Chip`, opted in through the `data-color="info"` attribute.

  HeroUI's `color` prop cannot express colors outside its own set, so the attribute carries the color instead — the same pattern `Button` already uses. All four variants are covered:

  ```tsx
  <Chip data-color="info" variant="soft">
    Info
  </Chip>
  ```

  | variant     | background           | foreground               |
  | ----------- | -------------------- | ------------------------ |
  | `primary`   | `--info`             | `--info-foreground`      |
  | `secondary` | `--default`          | `--info-soft-foreground` |
  | `tertiary`  | transparent + border | `--info-soft-foreground` |
  | `soft`      | `--info-soft`        | `--info-soft-foreground` |

  `color` and `data-color` may be combined; `data-color` wins by specificity.

- Restore brand base colors for soft foregrounds in light mode.

  HeroUI v3.2 changed the formula to mix `--foreground` into soft foregrounds for higher contrast (for example, `accent 70% + foreground 30%`). Light mode now keeps the plain brand color for `accent`, `danger`, `success`, `warning`, and `info`, while dark mode follows the HeroUI values.

  `info` tokens are also restructured to match HeroUI's own layout — `--info-hover`, `--info-soft`, `--info-soft-hover`, and `--info-soft-foreground` are declared in `@layer base` with `--color-info-*` aliases exposed as Tailwind utilities, including dark mode soft opacities.

## 2.2.0

### Minor Changes

- Remove Chip base and size overrides so Chip follows HeroUI v3 default sizing.

  `.chip`, `.chip--sm`, and `.chip--lg` no longer force fixed heights (24/32/36px) and custom radii. Chip now renders with HeroUI's padding-based sizing and `rounded-2xl`. Only the `.chip--tertiary` border override remains.

  The `--spacing-chip-*` and `--radius-chip-*` tokens are unchanged, but they are now used exclusively by Tag and ToggleButton. Documentation has been updated to reflect this.

## 2.1.0

### Minor Changes

- Switch the gray palette to hex values and add surface tokens
  - Changed `--color-gray-50` ~ `--color-gray-900` from oklch to hex values
  - Removed `--color-gray-950` (scale reduced to 10 steps)
  - Added `--border` (gray-200) and `--default` (gray-50) tokens to the light theme
  - Updated the design token docs in README / llms.txt to match the current palette

## 2.0.1

### Patch Changes

- Relax the HeroUI peer dependency from a pinned 3.0.1 to the 3.x range

## 2.0.0

### Major Changes

- Component size system rework

  **Breaking Changes**
  - Renamed utilities: `input-size-lg` → `input-size`, `input-text-lg` → `input-text`
  - Renamed token `--spacing-input-lg` → `--spacing-input`, removed `--radius-input-lg`
  - Input family (Input, InputGroup, Select, Textarea, NumberField, SearchField) height reduced from 48px to 40px (now based on button-md)
  - Input text size changed from text-base to text-sm
  - Small button reduced — height h-9 → h-8, text text-sm → text-xs
  - Semantic colors switched to the AXHub Console palette — adjusted success/warning values, added accent (#2d64fa)

  **New Features**
  - Added info color (+ info-hover/soft derived tokens) and Button `data-color="info"` variant (soft/ghost)

  **Changes**
  - NumberField stepper button width now tracks `--spacing-input` (fixed 48px → input height + 4px)
  - Spacing token comments now state actual usage (height/size/gap)

## 1.0.3

### Patch Changes

- Expand README component reference and add llms.txt

## 1.0.2

### Patch Changes

- Initial release
