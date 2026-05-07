"use client";

import { useEffect, useRef } from "react";

interface Milestone {
  phase: string;
  label: string;
  description: string;
  badge?: string;
}

const milestones: Milestone[] = [
  {
    phase: "Source",
    label: "Tag the item",
    description:
      "Encode sheets, towels, gowns, uniforms, and rental garments with durable washable  . Assign SKU, customer, and site in the dashboard.",
  },
  {
    phase: "Collection",
    label: "Scan at pickup",
    description:
      "Handhelds or choke-point portals register soiled loads by cart, chute, or floor — no line-by-line manual keys.",
    badge: "Chute / cart read",
  },
  {
    phase: "Processing",
    label: "Track wash & sort",
    description:
      "Tunnel washers, dryers, and sort conveyors capture reads so you reconcile weight, piece count, and customer splits with evidence.",
    badge: "Plant visibility",
  },
  {
    phase: "Fulfillment",
    label: "Storage & dispatch",
    description:
      "Clean-stock cages, rail storage, and outbound docks confirm what left, for which route or property, before the truck rolls.",
    badge: "Dispatch proof",
  },
  {
    phase: "Operations",
    label: "Dashboard & alerts",
    description:
      "Par levels, shrink hotspots, wash cycles, and SLA breaches surface in one view for procurement, laundry, and housekeeping leadership.",
    badge: "Live KPIs",
  },
  {
    phase: "Enterprise",
    label: "Multi-site roll-up",
    description:
      "Roll up portfolios — flags, hospitals, plants, and 3PL partners — with consistent item master data and role-based access.",
    badge: "Portfolio view",
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    if (lineRef.current) observer.observe(lineRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="journey" className="overflow-hidden bg-navy px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <div
          ref={(el) => {
            itemRefs.current[0] = el;
          }}
          className="timeline-item mb-20"
        >
          <p className="mb-4 text-[11px] font-semibold tracking-widest2 text-amber uppercase">
            How it works
          </p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.08] text-altimeter italic">
            Tag once.
            <br />
            <span className="font-semibold not-italic text-amber">
              Track everywhere it moves.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-lg font-light leading-relaxed text-haze/60">
            A practical textile lifecycle — from first encode through multi-site
            reporting — without ripping out your existing laundry equipment.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[22px] w-px bg-haze/10">
            <div
              ref={lineRef}
              className="timeline-line-fill w-full bg-amber"
            />
          </div>

          <div className="flex flex-col gap-0">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.label}
                ref={(el) => {
                  itemRefs.current[index + 1] = el;
                }}
                className="timeline-item relative flex gap-8 pb-12"
                style={{ transitionDelay: `${index * 0.12}s` }}
              >
                <div className="flex w-11 shrink-0 justify-center">
                  <div
                    className={`z-10 flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      index === 0
                        ? "border-amber bg-amber"
                        : "border-haze/20 bg-navy group-hover:border-amber"
                    }`}
                  >
                    <span
                      className={`font-display text-[10px] font-bold ${
                        index === 0 ? "text-navy-deep" : "text-amber"
                      }`}
                    >
                      {index === 0 ? "✦" : index}
                    </span>
                  </div>
                </div>

                <div className="flex-1 pt-2 pb-2">
                  <div className="mb-1 flex flex-wrap items-center gap-3">
                    <span className="font-display text-[1.35rem] font-semibold text-altimeter">
                      {milestone.label}
                    </span>
                    {milestone.badge && (
                      <span className="rounded-full border border-amber/20 bg-amber/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber">
                        {milestone.badge}
                      </span>
                    )}
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-amber">
                      {milestone.phase}
                    </span>
                  </div>
                  <p className="max-w-md text-[0.95rem] font-light leading-relaxed text-haze/60">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={(el) => {
            itemRefs.current[milestones.length + 1] = el;
          }}
          className="timeline-item mt-8 border-t border-haze/10 pt-10"
          style={{ transitionDelay: `${milestones.length * 0.12}s` }}
        >
          <p className="mb-6 max-w-md text-sm font-light text-haze/50">
            Request the deployment overview — hardware footprint, integration
            options, and a sample rollout timeline for your portfolio.
          </p>
          <a
            href="#email-capture"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-amber transition-colors hover:text-amber-light"
          >
            <span>Email me the overview</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-7-7 7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
