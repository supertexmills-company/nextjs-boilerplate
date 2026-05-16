import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SkeletonProps = ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        "animate-[skeleton-pulse_1.6s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    />
  );
}
