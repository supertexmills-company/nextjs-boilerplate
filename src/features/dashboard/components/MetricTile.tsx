import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricTileProps = {
  label: string;
  value: ReactNode;
  /** Optional footnote (small caption below value) */
  hint?: ReactNode;
  /** Optional delta string like "+12% vs 7d" or "-2.4%" */
  delta?: string;
  /** Direction of the delta — drives color */
  deltaDirection?: "up" | "down" | "neutral";
  /** Inverted = higher is bad (e.g. Missing / Active alerts). When true, "up" reads danger and "down" reads success. */
  invertDelta?: boolean;
  icon?: ReactNode;
  /** Highlight tone — "alert" = brass-tinted ring + color-on-number */
  variant?: "default" | "alert";
  className?: string;
};

function deltaColor(direction: "up" | "down" | "neutral", inverted: boolean): string {
  if (direction === "neutral") return "text-muted-foreground";
  const isPositive = inverted ? direction === "down" : direction === "up";
  return isPositive ? "text-[var(--success)]" : "text-[var(--danger)]";
}

/**
 * Stat tile — refined luxury KPI display.
 * Renders a kicker label, a large mono numeral, optional hint, optional delta chip with directional arrow.
 */
export function MetricTile({
  label,
  value,
  hint,
  delta,
  deltaDirection = "neutral",
  invertDelta = false,
  icon,
  variant = "default",
  className,
}: MetricTileProps) {
  const isAlert = variant === "alert";

  return (
    <Card
      className={cn(
        "metric-tile relative overflow-hidden rounded-[24px] px-6 py-6",
        isAlert &&
          "border-[color-mix(in_srgb,var(--accent)_30%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_6%,var(--card))]",
        className,
      )}
    >
      {isAlert ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-70"
          aria-hidden
        />
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="kicker text-[10px]">{label}</p>
          <p
            className={cn(
              "font-mono text-4xl font-semibold leading-none tracking-[-0.02em] tabular-nums text-foreground",
              isAlert && "text-[var(--accent)]",
            )}
          >
            {value}
          </p>
          {(hint || delta) && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {delta ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                    deltaColor(deltaDirection, invertDelta),
                  )}
                >
                  {deltaDirection === "up" ? (
                    <ArrowUpRight className="size-3" aria-hidden />
                  ) : deltaDirection === "down" ? (
                    <ArrowDownRight className="size-3" aria-hidden />
                  ) : null}
                  {delta}
                </span>
              ) : null}
              {hint ? <p className="text-xs text-[var(--text-soft)]">{hint}</p> : null}
            </div>
          )}
        </div>

        {icon ? (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]",
              "[&_svg]:size-4",
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
