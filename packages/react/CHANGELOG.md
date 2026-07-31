# @demodev-ui/react

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
