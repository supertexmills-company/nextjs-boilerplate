import { cn } from "@/lib/utils";

/** Native selects matching `Input` treatment */
export function fieldClassName(className?: string) {
  return cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-[border-color,box-shadow,background-color]",
    "focus-visible:border-[color-mix(in_srgb,var(--amber)_70%,var(--input))] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--amber)_28%,transparent)] focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );
}
