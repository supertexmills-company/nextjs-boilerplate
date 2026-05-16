"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SegmentOption<T extends string> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: SegmentOption<T>[];
  className?: string;
  size?: "sm" | "md";
  "aria-label"?: string;
};

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  size = "md",
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={props["aria-label"]}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/40 p-0.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 ease-[var(--ease)]",
              size === "sm" ? "h-7 px-3 text-xs" : "h-8 px-3.5 text-sm",
              active
                ? "bg-background text-foreground shadow-[var(--e1)]"
                : "text-muted-foreground hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--brass)_40%,transparent)]",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
export type { SegmentOption };
