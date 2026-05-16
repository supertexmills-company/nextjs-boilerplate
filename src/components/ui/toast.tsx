"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import type { ComponentProps } from "react";

/**
 * Toaster - mount once at the app root (already wired in app/layout.tsx).
 * Use `toast.success(...)`, `toast.error(...)`, `toast.info(...)`.
 */
function Toaster(props: ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      position="top-right"
      richColors={false}
      closeButton
      duration={4500}
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-border bg-popover text-popover-foreground shadow-[var(--e3)]",
          description: "text-xs text-muted-foreground",
          title: "text-sm font-medium",
          actionButton: "bg-[var(--brass)] text-[var(--ink)] rounded-full",
          cancelButton: "bg-muted text-muted-foreground rounded-full",
          success: "border-[color-mix(in_srgb,var(--success)_30%,var(--border))]",
          error: "border-[color-mix(in_srgb,var(--danger)_30%,var(--border))]",
          warning: "border-[color-mix(in_srgb,var(--warning)_30%,var(--border))]",
          info: "border-[color-mix(in_srgb,var(--info)_30%,var(--border))]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
