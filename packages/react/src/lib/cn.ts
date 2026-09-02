import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting later Tailwind utilities win over earlier ones that
 * target the same property. Carried up from axhub-frontend's `src/lib/utils.ts`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
