"use client";

import { useEffect, useRef } from "react";

interface LogEntry {
  title: string;
  value: string;
  detail: string;
  trend: string;
}

const logEntries: LogEntry[] = [
  {
    title: "Inventory overview",
    value: "98.7%",
    detail: "Inventory confidence across active hotel operations",
    trend: "+4.1% quarter-over-quarter",
  },
  {
    title: "Missing item alerts",
    value: "42",
    detail: "High-priority exceptions resolved this month",
    trend: "Faster intervention workflows",
  },
  {
    title: "Usage analytics",
    value: "12%",
    detail: "Reduction in avoidable replacement spend",
    trend: "Improved lifecycle decisions",
  },
  {
    title: "Cost tracking",
    value: "Up to 70%",
    detail: "Operational loss reduction potential",
    trend: "Measured from baseline to steady-state operations",
  },
];

/**
 * DashboardPreviewSection — a curated peek at the product, framed inside a
 * browser-window chrome so it visually reads as "product mock", not "social
 * proof". This replaces the role the old TestimonialsSection used to play.
 *
 * The numbers shown here are illustrative summary KPIs; they are NOT
 * customer-attributed (that role now lives in CredibilityBar). They mirror the
 * MetricTile language used inside the real dashboard.
 */
export default function DashboardPreviewSection() {
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    entryRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="dashboard-preview" className="bg-[var(--porcelain)] px-6 py-28 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl md:mb-16">
          <p className="kicker mb-3">Inside the platform</p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium leading-[1.02] tracking-[var(--tracking-display)] text-foreground">
            A premium command view for hotel operations.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            Monitor inventory, usage, cost impact, and operational exceptions in
            one enterprise-grade interface built for fast, confident decisions.
          </p>
        </div>

        {/* Browser-window chrome wrapper — signals "this is the product" */}
        <div className="overflow-hidden rounded-[24px] border border-border bg-[var(--surface)] shadow-[var(--e3)]">
          <div className="flex items-center gap-2 border-b border-border bg-[var(--surface-2)] px-4 py-3">
            <span className="size-2.5 rounded-full bg-[color-mix(in_srgb,var(--danger)_55%,transparent)]" aria-hidden />
            <span className="size-2.5 rounded-full bg-[color-mix(in_srgb,var(--accent-soft)_75%,transparent)]" aria-hidden />
            <span className="size-2.5 rounded-full bg-[color-mix(in_srgb,var(--success)_55%,transparent)]" aria-hidden />
            <span className="ml-3 truncate text-[11px] font-medium uppercase tracking-[var(--tracking-widest2)] text-muted-foreground">
              app.tantava.io / dashboard / overview
            </span>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {logEntries.map((log, index) => (
                <article
                  key={log.title}
                  ref={(el) => {
                    entryRefs.current[index] = el as HTMLDivElement;
                  }}
                  className="log-entry rounded-[18px] border border-border bg-[var(--surface)] p-6"
                  style={{ transitionDelay: `${(index % 4) * 70}ms` }}
                >
                  <p className="kicker mb-3">{log.title}</p>
                  <p className="font-mono text-[clamp(1.8rem,3.4vw,2.4rem)] font-semibold leading-none tracking-[var(--tracking-display)] text-[var(--accent)] tabular-nums">
                    {log.value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {log.detail}
                  </p>
                  <div className="mt-4 inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-3 py-1.5">
                    <p className="text-[10.5px] font-medium uppercase tracking-wide text-[var(--accent)]">
                      {log.trend}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Illustrative metrics. Live data shown after sign-in.
        </p>
      </div>
    </section>
  );
}
