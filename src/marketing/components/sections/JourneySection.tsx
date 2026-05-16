"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

interface Milestone {
  phase: string;
  label: string;
  description: string;
  badge?: string;
}

const milestones: Milestone[] = [
  {
    phase: "Step 1",
    label: "Items are digitally registered",
    description:
      "Linen, uniforms, and textile assets are added to a central system with standardized information across operations.",
    badge: "Unified records",
  },
  {
    phase: "Step 2",
    label: "Movement is captured across departments",
    description:
      "As items move through housekeeping, laundry, storage, and distribution, activity is tracked automatically.",
    badge: "Automatic tracking",
  },
  {
    phase: "Step 3",
    label: "Usage and lifecycle are monitored in real time",
    description:
      "Leaders gain clear visibility into inventory health, usage behavior, and operational trends throughout each cycle.",
    badge: "Live visibility",
  },
  {
    phase: "Step 4",
    label: "Alerts surface missing and abnormal patterns",
    description:
      "Proactive notifications help teams act early on unusual movement, missing items, and potential cost leakage.",
    badge: "Early intervention",
  },
];

export default function JourneySection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    if (lineRef.current) observer.observe(lineRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="journey" className="section-dark relative overflow-hidden bg-[var(--surface-2)] px-6 py-28 md:py-32">

      <div className="relative z-[1] mx-auto max-w-4xl">
        <div
          ref={(el) => {
            itemRefs.current[0] = el;
          }}
          className="timeline-item mb-16 md:mb-20"
        >
          <p className="kicker mb-3">How it works</p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium leading-[1.02] tracking-[var(--tracking-display)] text-[var(--text)]">
            A simple flow for smarter hotel operations.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--text-soft)]">
            The platform turns fragmented operational activity into one clear decision layer your teams can use every
            day.
          </p>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-[22px] top-0 w-px bg-border">
            <div ref={lineRef} className="timeline-line-fill w-full bg-[var(--accent)]" />
          </div>

          <div className="flex flex-col gap-0">
            {milestones.map((m, index) => (
              <div
                key={m.label}
                ref={(el) => {
                  itemRefs.current[index + 1] = el;
                }}
                className="timeline-item relative flex gap-8 pb-12"
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <div className="flex w-11 shrink-0 justify-center">
                  <div className="z-10 flex size-[44px] shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))]">
                    <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden />
                  </div>
                </div>

                <div className="flex-1 pt-2 pb-2">
                  <div className="mb-1 flex flex-wrap items-center gap-3">
                    <span className="font-display text-[1.3rem] font-medium text-[var(--text)]">{m.label}</span>
                    {m.badge ? (
                      <span className="rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wide text-[var(--accent)]">
                        {m.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[var(--tracking-widest2)] text-[var(--accent)]">
                    {m.phase}
                  </p>
                  <p className="max-w-md text-[15px] leading-relaxed text-[var(--text-soft)]">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={(el) => {
            itemRefs.current[milestones.length + 1] = el;
          }}
          className="timeline-item mt-8 border-t border-border pt-10"
          style={{ transitionDelay: `${milestones.length * 110}ms` }}
        >
          <p className="mb-6 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
            See how this model fits your operating footprint and where the fastest ROI opportunities exist.
          </p>
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-soft)]"
          >
            Talk to sales
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
