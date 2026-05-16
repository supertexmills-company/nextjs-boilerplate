"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  /** @deprecated retained for backwards-compat; new logo uses an inline mark instead of an SVG asset */
  src?: string;
  /** @deprecated retained for backwards-compat with prior consumer call sites */
  iconName?: string;
  text?: string;
  size?: number;
  className?: string;
  tone?: "auto" | "light" | "dark";
  onClick?: () => void;
}

/**
 * Tantava wordmark — small brass diamond mark + display wordmark.
 * Pass `tone="dark"` on light-background surfaces (header on white), `tone="light"` on dark.
 */
function AppLogo({
  text = "Tantava",
  size = 36,
  className = "",
  tone = "auto",
  onClick,
}: AppLogoProps) {
  const isLight = tone === "light";
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5",
        onClick && "cursor-pointer transition-opacity hover:opacity-90",
        className,
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center rounded-xl",
          "bg-[color-mix(in_srgb,var(--brass)_16%,transparent)] text-[var(--brass)]",
          isLight && "bg-[color-mix(in_srgb,var(--brass)_22%,var(--ink))]",
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Sparkles className="size-[44%]" strokeWidth={1.8} />
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset",
            "ring-[color-mix(in_srgb,var(--brass)_30%,transparent)]",
          )}
        />
      </span>
      {text ? (
        <span
          className={cn(
            "font-display font-semibold tracking-[var(--tracking-heading)]",
            isLight ? "text-[var(--moonlight)]" : isDark ? "text-foreground" : "",
          )}
          style={{ fontSize: Math.max(15, Math.round(size * 0.52)) }}
        >
          {text}
        </span>
      ) : null}
    </div>
  );
}

export default AppLogo;
