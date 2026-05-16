"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

type AuthShellProps = {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** Optional back-link / alt-action link row above the card */
  topRight?: ReactNode;
  children: ReactNode;
};

function TantavaLockup() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex size-10 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-[var(--accent)]">
        <Sparkles className="size-4" strokeWidth={1.8} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
          aria-hidden
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[24px] font-semibold tracking-[var(--tracking-heading)] text-foreground">
          Tantava
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[var(--tracking-widest2)] text-muted-foreground">
          Operations
        </span>
      </div>
    </div>
  );
}

export function AuthShell({ title, description, footer, topRight, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile brand strip */}
      <div className="relative border-b border-border bg-[var(--sidebar)] px-6 pb-6 pt-8 md:hidden">
        <div className="relative">
          <TantavaLockup />
        </div>
      </div>

      <aside className="relative hidden min-h-screen w-[44%] flex-col justify-between border-r border-border bg-[var(--sidebar)] px-10 py-14 lg:w-[48%] lg:px-14 lg:py-16 md:flex">
        <div className="relative z-[1] space-y-12">
          <TantavaLockup />
          <div className="space-y-5">
            <p className="kicker">A trusted operations partner</p>
            <h2 className="font-display max-w-md text-[42px] font-medium leading-[1.02] tracking-[var(--tracking-display)] text-[var(--text)]">
              Every textile, accounted for.
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-[var(--text-soft)]">
              Real-time visibility from wash through dispatch — trusted by hotels, hospitals, and rental laundry
              networks.
            </p>
          </div>
        </div>

        <ul className="relative z-[1] grid max-w-sm gap-2 text-sm text-[var(--text-soft)]">
          <li className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[var(--accent)]" aria-hidden /> SOC-minded · audit-ready
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[var(--accent)]" aria-hidden /> Built for textile operations
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[var(--accent)]" aria-hidden /> Live signals, calm UI
          </li>
        </ul>
      </aside>

      <div className="relative flex flex-1 flex-col justify-center bg-[var(--bg)] px-4 py-10 md:px-10 lg:px-16">
        <div className="relative z-[1] mx-auto flex w-full max-w-md flex-col">
          <div className="mb-5 flex items-center justify-between gap-2 text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden /> Back to home
            </Link>
            {topRight}
          </div>
          <div className="luxury-card luxury-enter p-8 md:p-10">
            <header className="mb-7 space-y-2">
              <h1 className="font-display text-[40px] font-medium leading-[1] tracking-[var(--tracking-display)] text-foreground">
                {title}
              </h1>
              {description ? <div className="text-[15px] leading-relaxed text-muted-foreground">{description}</div> : null}
            </header>
            {children}
            {footer ? <div className="mt-7 border-t border-border pt-6">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
