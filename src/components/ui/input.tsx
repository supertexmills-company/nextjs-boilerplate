import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color]",
        "placeholder:text-muted-foreground",
        "caret-[color-mix(in_srgb,var(--amber)_88%,white)]",
        "focus-visible:border-[color-mix(in_srgb,var(--amber)_70%,var(--input))] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--amber)_28%,transparent)] focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
