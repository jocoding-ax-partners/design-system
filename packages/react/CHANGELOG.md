# @demodev-ui/react

## 2.0.0

### Major Changes

- 컴포넌트 사이즈 체계 개편

  **Breaking Changes**
  - `input-size-lg` → `input-size`, `input-text-lg` → `input-text` 유틸리티 개명
  - `--spacing-input-lg` → `--spacing-input` 토큰 개명, `--radius-input-lg` 토큰 제거
  - input 계열(Input, Select, Textarea, NumberField, SearchField) 높이 48px → 40px (button-md 기준)
  - sm 버튼 축소 — 높이 h-9 → h-8, 텍스트 text-sm → text-xs

  **Changes**
  - NumberField 증감 버튼 너비를 `--spacing-input` 연동으로 변경 (고정 48px → input 높이 + 4px)
  - spacing 토큰 주석을 실제 용도에 맞게 명시 (height/size/gap)

## 1.0.3

### Patch Changes

- Expand README component reference and add llms.txt

## 1.0.2

### Patch Changes

- Initial release
