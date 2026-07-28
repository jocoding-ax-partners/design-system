# @demodev-ui/react

## 2.0.1

### Patch Changes

- HeroUI peer dependency를 3.0.1 고정에서 3.x 범위로 완화

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
