import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[88px] w-full rounded-lg border border-input bg-background px-3.5 py-3",
        "text-[15px] leading-relaxed text-foreground",
        "transition-[border-color,box-shadow,background-color] duration-150 ease-[var(--ease)]",
        "placeholder:text-muted-foreground/70",
        "caret-[var(--brass)] resize-y",
        "focus-visible:border-[color-mix(in_srgb,var(--brass)_70%,var(--input))] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--brass)_22%,transparent)] focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
