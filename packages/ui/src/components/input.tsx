import { tv, Input as HeroInput, type InputProps, type VariantProps } from "@heroui/react";

const inputVariants = tv({
  base: "",
  variants: {
    size: {
      sm: "",
      lg: "h-12",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export function Input({
  size,
  className,
  ...props
}: Omit<InputProps, "className" | "size"> &
  VariantProps<typeof inputVariants> & {
    className?: string;
  }) {
  return <HeroInput className={inputVariants({ size, className })} {...props} />;
}
