import { SearchField } from "@heroui/react";
import { forwardRef, useEffect, useRef, useState } from "react";

import { cn } from "./lib/cn";

interface SearchBoxProps {
  value: string;
  placeholder?: string;
  className?: string;
  /** 입력 너비 — default w-56 */
  widthClass?: string;
  /** 입력 디바운스(ms). 0 이면 즉시 반영 (default 0) */
  debounceMs?: number;
  /** 마운트 시 입력에 자동 포커스 (default false) */
  autoFocus?: boolean;
  /**
   * 입력 룩 — `secondary`(default) 는 테두리 없는 회색 채움, `primary` 는 흰 배경 + 테두리.
   * dac `.search`(흰 배경 + 1px 테두리) 를 대체한 자리는 `primary` 를 쓴다.
   */
  variant?: "primary" | "secondary";
  onChange: (v: string) => void;
}

/**
 * SearchBox — AXHub 검색바. HeroUI `SearchField` 기반 래퍼.
 *
 * - 검색 아이콘·clear 버튼(입력 시 자동 표시, 클릭 또는 Esc 로 지우기)은 SearchField 내장 동작.
 * - debounceMs 지정 시 onChange 디바운스(목록 검색 등). 미지정 시 즉시 반영.
 * - clear(버튼·Esc) 는 디바운스를 우회해 즉시 반영되도록 타이머를 취소한다.
 */
export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(function SearchBox(
  {
    value,
    onChange,
    placeholder = "검색",
    className,
    widthClass = "w-56",
    debounceMs = 0,
    autoFocus = false,
    variant = "secondary",
  },
  ref,
) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 외부 value 변경 동기화 (필터 리셋 등)
  useEffect(() => setLocal(value), [value]);
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  function emit(v: string) {
    setLocal(v);
    if (debounceMs > 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => onChange(v), debounceMs);
    } else {
      onChange(v);
    }
  }

  function clear() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setLocal("");
    onChange("");
  }

  return (
    <SearchField
      variant={variant}
      value={local}
      onChange={emit}
      onClear={clear}
      aria-label={placeholder}
      className={cn(widthClass, className)}
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input ref={ref} placeholder={placeholder} autoFocus={autoFocus} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
});
