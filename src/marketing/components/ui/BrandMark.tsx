"use client";

import type { CSSProperties } from "react";

/**
 * BrandMark — Tantava custom logomark (scaffold).
 *
 * Replaces the previous stock `Sparkles` lucide icon at every brand touchpoint.
 * Inline SVG, single-color via `currentColor`, accepts a `size` prop.
 *
 * Design intent: two interlocking diamond strokes form a subtle "T" ligature
 * suggesting woven thread / textile. Renders crisply at 16px through 96px.
 *
 * TODO(brand): when a designer delivers a final logomark, replace the SVG
 * path data below. The component API (props, sizing, color inheritance)
 * should not need to change.
 */

type BrandMarkProps = {
  /** CSS size value — accepts numbers (px) or strings (e.g. "60%", "1.5rem"). */
  size?: number | string;
  className?: string;
  /** Optional aria-label; defaults to decorative. */
  title?: string;
};

export function BrandMark({ size = 24, className, title }: BrandMarkProps) {
  const style: CSSProperties = {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
  };

  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {/* Outer diamond — reads as a portal / tag silhouette */}
      <path d="M16 3.5 L28.5 16 L16 28.5 L3.5 16 Z" />
      {/* Inner thread — vertical stroke (the 'T' stem) */}
      <path d="M16 8.5 V23.5" />
      {/* Inner thread — diagonal weave anchored to the diamond corners */}
      <path d="M9.25 13 L22.75 13" />
      {/* Subtle accent dot at center, marking the 'point of visibility' */}
      <circle cx="16" cy="16" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default BrandMark;
