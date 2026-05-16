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

const trustSignals = [
  "Built for large-scale hospitality operations",
  "Designed for operational excellence in premium hotel groups",
  "Trusted for improving inventory efficiency and control",
];

export default function TestimonialsSection() {
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
    <section id="stories" className="bg-[var(--porcelain)] px-6 py-28 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 md:mb-16">
          <p className="kicker mb-3">Dashboard preview</p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium leading-[1.02] tracking-[var(--tracking-display)] text-foreground">
            A premium command view for hotel operations.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            Monitor inventory, usage, cost impact, and operational exceptions in one enterprise-grade interface built for
            fast, confident decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {logEntries.map((log, index) => (
            <article
              key={log.title}
              ref={(el) => {
                entryRefs.current[index] = el as HTMLDivElement;
              }}
              className="log-entry luxury-card p-7 md:p-8"
              style={{ transitionDelay: `${(index % 2) * 80}ms` }}
            >
              <p className="kicker mb-3">{log.title}</p>
              <p className="font-mono text-[clamp(2rem,4vw,2.6rem)] font-semibold leading-none tracking-[var(--tracking-display)] text-[var(--accent)] tabular-nums">
                {log.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{log.detail}</p>
              <div className="mt-5 inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-3 py-1.5">
                <p className="text-[11px] font-medium tracking-wide text-[var(--accent)] uppercase">
                  {log.trend}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] border border-border bg-[var(--surface)] p-6 shadow-[var(--e1)] md:p-8">
          <p className="kicker mb-4">Trust and credibility</p>
          <div className="grid gap-3 md:grid-cols-3">
            {trustSignals.map((signal, index) => (
              <p
                key={signal}
                className="rounded-[16px] border border-border bg-[var(--surface)] px-4 py-4 text-sm leading-relaxed text-muted-foreground"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                {signal}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
