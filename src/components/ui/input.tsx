import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-[16px] border border-input bg-[var(--surface)] px-4 py-3",
        "text-[15px] text-foreground leading-none",
        "transition-[border-color,box-shadow,background-color] duration-[var(--duration-base)] ease-[var(--ease)]",
        "placeholder:text-[var(--muted)]",
        "caret-[var(--accent)]",
        "focus-visible:border-[color-mix(in_srgb,var(--accent)_70%,var(--input))] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--accent)_22%,transparent)] focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "file:mr-3 file:py-1 file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
