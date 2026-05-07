"use client";

import type { ReactNode } from "react";

import AppLogo from "@/marketing/components/ui/AppLogo";

type AuthShellProps = {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthShell({ title, description, footer, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile brand strip */}
      <div className="booking-bg relative px-6 py-8 md:hidden">
        <div className="surface-grain" aria-hidden />
        <AppLogo size={36} src="/brand/linetrack-logo.svg" iconName="SignalIcon" text="LineTrack" className="text-altimeter [&_span]:text-lg" />
        <p className="kicker mt-6 text-altimeter">Enterprise linen intelligence</p>
      </div>

      {/* Desktop hero panel */}
      <aside className="relative hidden min-h-screen w-[42%] flex-col justify-between booking-bg px-10 py-14 lg:w-[45%] lg:px-14 lg:py-16 md:flex">
        <div className="surface-grain" aria-hidden />
        <div className="relative z-[1] space-y-8">
          <AppLogo size={40} src="/brand/linetrack-logo.svg" iconName="SignalIcon" text="LineTrack" className="text-amber [&_span]:text-xl [&_span]:font-semibold [&_span]:tracking-tight" />
          <div className="space-y-4">
            <p className="kicker text-altimeter/90">Altitude · LineTrack</p>
            <h2 className="font-display max-w-md text-3xl font-light leading-[1.15] text-altimeter lg:text-4xl">
              Every piece of linen,
              <br />
              <span className="font-semibold not-italic">accounted for.</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-altimeter/65">
              Real-time visibility from wash through dispatch — trusted by hotels, hospitals, and rental laundry
              networks.
            </p>
          </div>
        </div>
        <p className="relative z-[1] text-[11px] font-medium uppercase tracking-widest text-altimeter/40">
          SOC-minded · Audit-ready · Built for operations
        </p>
      </aside>

      {/* Form column */}
      <div className="relative flex flex-1 flex-col justify-center bg-background px-4 py-10 md:px-10 lg:px-16">
        <div className="surface-grain opacity-[0.02]" aria-hidden />
        <div className="relative z-[1] mx-auto w-full max-w-md">
          <div className="luxury-card luxury-card--accent luxury-enter p-8 md:p-10">
            <header className="mb-8 space-y-2">
              <h1 className="font-display text-2xl font-light tracking-tight text-foreground md:text-[1.75rem]">
                {title}
              </h1>
              {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
            </header>
            {children}
            {footer ? <div className="mt-8 border-t border-border/80 pt-6">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
