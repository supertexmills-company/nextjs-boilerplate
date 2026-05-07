import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        outline: "border-border bg-transparent text-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

function Badge({
  className,
  variant,
  dot,
  tone = "default",
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
    tone?: "default" | "admin" | "user" | "info" | "warning" | "critical" | "success";
  }) {
  const showDot = Boolean(dot);
  const dotClass =
    tone === "admin"
      ? "bg-amber"
      : tone === "user"
        ? "bg-haze"
        : tone === "info"
          ? "bg-sky-400/95"
          : tone === "warning"
            ? "bg-amber"
            : tone === "critical"
              ? "bg-destructive"
              : tone === "success"
                ? "bg-emerald-500"
                : "bg-muted-foreground/55";

  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), showDot && "pl-2", className)} {...props}>
      {showDot ? (
        <>
          <span className={cn("size-1.5 shrink-0 rounded-full", dotClass)} aria-hidden />
          {children}
        </>
      ) : (
        children
      )}
    </span>
  );
}

export { Badge, badgeVariants };
