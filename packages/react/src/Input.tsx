import { Input as HeroInput, InputGroup, Label } from "@heroui/react";
import { IconContext } from "@phosphor-icons/react";
import { forwardRef, useContext, useId, type InputHTMLAttributes, type ReactNode } from "react";

// AXHub Input — HeroUI v3(react-aria) 프리미티브 위에 올린 얕은 래퍼.
// 필드 컨트롤/라벨은 HeroUI(@heroui/react)가 담당하고, 이 래퍼는 기존 호출부 API
// (label/helpText/errorText/leftSlot/rightSlot + 네이티브 input 속성)를 그대로 유지한다.
// value/onChange 는 네이티브 시맨틱(onChange 는 ChangeEvent) 그대로 — 표준 <input> 처럼 쓴다.
//
// 높이는 HeroUI 단일 스케일을 따른다 — size prop 없음. 특정 화면에서 폭/높이를 조절해야 하면
// className 으로 지정한다. (네이티브 size 속성도 Omit — 실수로 `size=` 를 넘기면 컴파일 에러)
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  helpText?: ReactNode;
  errorText?: ReactNode;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helpText, errorText, leftSlot, rightSlot, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hasError = !!errorText;
  // 슬롯 아이콘은 weight 만 "보조(regular)" 로 낮추고 나머지(size 등)는 상속한다.
  // context 를 통째로 교체하면 main.tsx 의 size:16 이 사라져 아이콘이 0×0 으로 렌더된다.
  const iconContext = { ...useContext(IconContext), weight: "regular" as const };
  const describedBy = hasError ? `${inputId}-err` : helpText ? `${inputId}-help` : undefined;

  // HeroUI Input / InputGroup.Input 공통으로 넘기는 네이티브 속성 + a11y/에러 상태.
  const fieldProps = {
    id: inputId,
    "aria-invalid": hasError || undefined,
    "aria-describedby": describedBy,
    // .input / .input-group 의 [data-invalid="true"] 셀렉터로 에러 스타일 활성화.
    "data-invalid": hasError || undefined,
    className,
    ...rest,
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <Label htmlFor={inputId} isInvalid={hasError}>
          {label}
        </Label>
      )}
      {leftSlot || rightSlot ? (
        // 에러 테두리는 그룹 루트에 걸린다(.input-group[data-invalid]). react-aria Group 은
        // raw data-* 를 걸러내므로 반드시 isInvalid prop 을 써야 한다 — data-invalid 를 직접
        // 넘기면 조용히 무시돼 아이콘 슬롯이 있는 필드만 에러 테두리를 잃는다.
        <InputGroup fullWidth isInvalid={hasError}>
          {leftSlot && (
            <InputGroup.Prefix>
              <IconContext.Provider value={iconContext}>{leftSlot}</IconContext.Provider>
            </InputGroup.Prefix>
          )}
          <InputGroup.Input ref={ref} {...fieldProps} />
          {rightSlot && (
            <InputGroup.Suffix>
              <IconContext.Provider value={iconContext}>{rightSlot}</IconContext.Provider>
            </InputGroup.Suffix>
          )}
        </InputGroup>
      ) : (
        <HeroInput ref={ref} fullWidth {...fieldProps} />
      )}
      {hasError ? (
        <span id={`${inputId}-err`} className="text-[12px] text-[var(--danger)]">
          {errorText}
        </span>
      ) : helpText ? (
        <span id={`${inputId}-help`} className="text-[12px] text-[var(--fg-muted)]">
          {helpText}
        </span>
      ) : null}
    </div>
  );
});
