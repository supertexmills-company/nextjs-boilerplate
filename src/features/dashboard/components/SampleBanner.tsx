"use client";

import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

/**
 * SampleBanner — pinned strip at the top of the /sample/dashboard route.
 *
 * Communicates "this is illustrative" and routes prospects back to the
 * marketing demo CTA. Brass-tinted for visibility without screaming.
 */
export function SampleBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-2.5 sm:items-center">
          <Info
            className="mt-0.5 size-4 shrink-0 text-[var(--accent)] sm:mt-0"
            strokeWidth={1.8}
            aria-hidden
          />
          <p className="text-sm leading-snug text-foreground">
            <span className="font-semibold">You&apos;re viewing a sample environment.</span>{" "}
            <span className="text-muted-foreground">
              Numbers are illustrative. Sign in to see your real operation.
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-[14px] border border-border bg-[var(--surface)] px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-[var(--surface-2)]"
          >
            Sign in
          </Link>
          <Link
            href="/#booking"
            className="btn-amber inline-flex h-9 items-center justify-center gap-2 rounded-[14px] px-4 text-[13px] font-semibold"
          >
            Request demo <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
