import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricTileProps = {
  label: string;
  value: ReactNode;
  /** Optional footnote or delta */
  hint?: ReactNode;
  icon?: ReactNode;
  /** Highlight missing / alert metrics */
  variant?: "default" | "alert";
  className?: string;
};

export function MetricTile({ label, value, hint, icon, variant = "default", className }: MetricTileProps) {
  return (
    <Card
      className={cn(
        "metric-tile relative overflow-hidden p-5",
        variant === "alert" && "border-amber/35 bg-[color-mix(in_srgb,var(--amber)_8%,var(--card))]",
        className,
      )}
    >
      {variant === "alert" ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-amber/80 to-transparent"
          aria-hidden
        />
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p
            className={cn(
              "font-mono text-3xl font-semibold tabular-nums tracking-tight text-foreground",
              variant === "alert" && "text-amber",
            )}
          >
            {value}
          </p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {icon ? <div className="text-amber/90 [&_svg]:size-5">{icon}</div> : null}
      </div>
    </Card>
  );
}
