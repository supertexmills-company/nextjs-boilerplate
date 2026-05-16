import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
    "text-[11px] font-medium leading-none tracking-[0.02em]",
    "transition-colors duration-[var(--duration-base)]",
  ].join(" "),
  {
    variants: {
      variant: {
        outline: "border border-border bg-transparent text-[var(--text-soft)]",
        secondary: "border border-transparent bg-secondary text-secondary-foreground",
        muted: "border border-transparent bg-muted text-muted-foreground",
        solid: "border border-transparent text-[var(--surface)]",
      },
      intent: {
        neutral: "",
        brand: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },
    },
    compoundVariants: [
      // Intent overlays for solid + outline variants
      {
        variant: "solid",
        intent: "brand",
        class: "bg-[var(--accent)] text-[var(--surface)]",
      },
      {
        variant: "solid",
        intent: "success",
        class: "bg-[var(--success)] text-white",
      },
      {
        variant: "solid",
        intent: "warning",
        class: "bg-[var(--warning)] text-[var(--text)]",
      },
      {
        variant: "solid",
        intent: "danger",
        class: "bg-[var(--danger)] text-white",
      },
      {
        variant: "solid",
        intent: "info",
        class: "bg-[var(--info)] text-white",
      },
      // Outline intent — colored ring + matching text
      {
        variant: "outline",
        intent: "brand",
        class:
          "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] text-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]",
      },
      {
        variant: "outline",
        intent: "success",
        class:
          "border-[color-mix(in_srgb,var(--success)_35%,transparent)] text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_8%,transparent)]",
      },
      {
        variant: "outline",
        intent: "warning",
        class:
          "border-[color-mix(in_srgb,var(--warning)_35%,transparent)] text-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]",
      },
      {
        variant: "outline",
        intent: "danger",
        class:
          "border-[color-mix(in_srgb,var(--danger)_35%,transparent)] text-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]",
      },
      {
        variant: "outline",
        intent: "info",
        class:
          "border-[color-mix(in_srgb,var(--info)_35%,transparent)] text-[var(--info)] bg-[color-mix(in_srgb,var(--info)_8%,transparent)]",
      },
    ],
    defaultVariants: {
      variant: "outline",
      intent: "neutral",
    },
  },
);

// Legacy `tone` -> `intent` mapping (kept so existing usages keep working)
const toneToIntent: Record<string, "neutral" | "brand" | "success" | "warning" | "danger" | "info"> = {
  default: "neutral",
  admin: "brand",
  user: "neutral",
  info: "info",
  warning: "warning",
  critical: "danger",
  success: "success",
};

function Badge({
  className,
  variant,
  intent,
  dot,
  tone,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
    /** @deprecated use `intent` */
    tone?: "default" | "admin" | "user" | "info" | "warning" | "critical" | "success";
  }) {
  const resolvedIntent = intent ?? (tone ? toneToIntent[tone] : "neutral");
  const showDot = Boolean(dot);

  const dotClass =
    resolvedIntent === "brand"
      ? "bg-[var(--brass)]"
      : resolvedIntent === "success"
        ? "bg-[var(--success)]"
        : resolvedIntent === "warning"
          ? "bg-[var(--warning)]"
          : resolvedIntent === "danger"
            ? "bg-[var(--danger)]"
            : resolvedIntent === "info"
              ? "bg-[var(--info)]"
              : "bg-muted-foreground/60";

  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, intent: resolvedIntent }), showDot && "pl-2", className)}
      {...props}
    >
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
