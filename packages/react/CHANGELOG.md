# @demodev-ui/react

## 2.4.2

### Patch Changes

- - Partially revert the switch to Tailwind's gray palette shipped in 2.4.1. The scale is now a hybrid: `gray-50`–`gray-400` stay on Tailwind's defaults, `gray-500`–`gray-950` go back to the custom values.
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
