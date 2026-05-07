import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SkeletonProps = ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)} {...props}>
      <div
        className="pointer-events-none absolute inset-0 animate-[skeleton-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--foreground)_12%,transparent)] to-transparent"
        aria-hidden
      />
    </div>
  );
}
