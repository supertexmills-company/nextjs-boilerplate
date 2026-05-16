import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2",
    "whitespace-nowrap rounded-[16px] border border-transparent bg-clip-padding font-medium",
    "transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-[var(--duration-base)] ease-[var(--ease)]",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--accent)_24%,transparent)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "hover:-translate-y-px",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "rounded-[16px] bg-[var(--accent)] text-[var(--surface)] font-semibold tracking-[0.01em]",
          "shadow-[var(--e1)]",
          "hover:bg-[var(--accent-soft)] hover:shadow-[var(--e2)]",
        ].join(" "),
        luxury: [
          "rounded-[16px] bg-[var(--accent)] text-[var(--surface)] font-semibold tracking-[0.01em]",
          "shadow-[var(--e1)]",
          "hover:bg-[var(--accent-soft)] hover:shadow-[var(--e2)]",
        ].join(" "),
        default: [
          "rounded-[16px] bg-[var(--surface)] text-[var(--text)] border-[var(--border)]",
          "hover:bg-[var(--surface-2)]",
        ].join(" "),
        secondary: [
          "rounded-[16px] bg-[var(--surface-2)] text-[var(--text-soft)] border-border",
          "hover:bg-[color-mix(in_srgb,var(--surface-2)_82%,var(--surface)_18%)] hover:text-[var(--text)]",
        ].join(" "),
        outline: [
          "rounded-[16px] border-border bg-transparent text-[var(--text-soft)]",
          "hover:bg-[var(--surface)] hover:text-[var(--text)] hover:border-[color-mix(in_srgb,var(--border)_60%,var(--accent)_40%)]",
        ].join(" "),
        soft: [
          "rounded-[16px] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_22%,transparent)]",
          "hover:bg-[color-mix(in_srgb,var(--accent)_20%,var(--surface))]",
        ].join(" "),
        ghost: [
          "rounded-[14px] text-[var(--text-soft)]",
          "hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
        ].join(" "),
        destructive: [
          "rounded-[16px] bg-[color-mix(in_srgb,var(--danger)_12%,var(--surface))] text-[var(--danger)] border-[color-mix(in_srgb,var(--danger)_24%,transparent)]",
          "hover:bg-[color-mix(in_srgb,var(--danger)_18%,transparent)]",
          "focus-visible:ring-[color-mix(in_srgb,var(--danger)_24%,transparent)]",
        ].join(" "),
        link: "rounded-none border-none px-0 py-0 text-[var(--accent)] underline-offset-4 hover:underline hover:text-[var(--accent-soft)] hover:translate-y-0",
      },
      size: {
        default: "h-10 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-8 px-2 text-xs gap-1 rounded-[14px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 px-3 text-sm gap-1.5 rounded-[14px] [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 px-4 text-sm rounded-[16px]",
        lg: "h-12 px-6 text-[15px] rounded-[16px]",
        xl: "h-14 px-8 text-base rounded-[18px]",
        icon: "size-10 rounded-[14px]",
        "icon-xs": "size-8 rounded-[14px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-[14px]",
        "icon-lg": "size-11 rounded-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
