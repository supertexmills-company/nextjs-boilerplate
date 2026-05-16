"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "Up to 70%", label: "Reduction in operational loss potential" },
  { value: "100%", label: "Cross-department visibility in one platform" },
  { value: "0", label: "Manual audit dependency for routine checks" },
  { value: "Faster", label: "Decision cycles for operations leadership" },
  { value: "Lower", label: "Unnecessary replacement spend over time" },
];

export default function CredibilityBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-y border-border bg-[var(--surface)] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="kicker mb-2">Value and ROI</p>
          <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.05] tracking-[var(--tracking-heading)] text-foreground">
            Clear operational impact that leadership can measure.
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-2 gap-y-8 md:grid-cols-5 md:gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center md:px-4 md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-[color-mix(in_srgb,var(--accent)_22%,transparent)] ${
                revealed ? "count-up" : "opacity-0"
              }`}
              style={{ animationDelay: revealed ? `${i * 90}ms` : undefined }}
            >
              <p className="mb-1.5 font-mono text-[clamp(1.8rem,2.5vw,2.2rem)] font-semibold leading-none tracking-[var(--tracking-display)] tabular-nums text-[var(--accent)]">
                {stat.value}
              </p>
              <p className="text-[10.5px] font-medium uppercase tracking-[var(--tracking-widest2)] text-[var(--text-soft)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
