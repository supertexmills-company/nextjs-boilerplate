"use client";

import { useEffect, useRef } from "react";

interface LogEntry {
  date: string;
  name: string;
  role: string;
  metric: string;
  metricCaption: string;
  facilityLine: string;
  entry: string;
}

const logEntries: LogEntry[] = [
  {
    date: "NOV 14, 2025",
    name: "Elena Marchetti",
    role: "VP Operations · Flagship hotel group",
    metric: "28%",
    metricCaption: "linen spend vs prior year",
    facilityLine: "EMEA · 9 properties",
    entry:
      "We stopped funding mystery shrink. Par levels by tower are boring in the best way — housekeeping and finance finally share one number.",
  },
  {
    date: "OCT 03, 2025",
    name: "James Okoro",
    role: "Director of Support Services · Acute care network",
    metric: "4.2M",
    metricCaption: "tagged pieces in service",
    facilityLine: "US Southeast · 6 hospitals",
    entry:
      "Infection prevention asked for lineage on isolation gowns. We deliver scan history in seconds, not a three-day file chase.",
  },
  {
    date: "SEP 21, 2025",
    name: "Sofia Lindström",
    role: "Plant Manager · Industrial laundry",
    metric: "12 min",
    metricCaption: "average inbound cage reconcile",
    facilityLine: "Nordics · single plant",
    entry:
      "Mis-sorts to our largest hotel contract dropped hard once dispatch reads were mandatory. Drivers see exceptions before they seal the trailer.",
  },
  {
    date: "AUG 07, 2025",
    name: "Marcus Webb",
    role: "COO · Textile rental",
    metric: "18%",
    metricCaption: "fewer billing disputes",
    facilityLine: "National routes · workwear",
    entry:
      "Customers used to argue delivery counts. Now scans at drop-off and pickup settle it. Sales actually likes us again.",
  },
  {
    date: "JUL 18, 2025",
    name: "Priya Nandakumar",
    role: "Head of Procurement · Facility management",
    metric: "3 days",
    metricCaption: "rolled portfolio audit",
    facilityLine: "Mixed sites · FM contract",
    entry:
      "We inherited linen from three vendors. LineTrack gave us one item master and a single dashboard for the client steering committee.",
  },
  {
    date: "JUN 29, 2025",
    name: "Tomás Álvarez",
    role: "Laundry Manager · Full-service hospital",
    metric: "99.1%",
    metricCaption: "cycle count accuracy (trial)",
    facilityLine: "LATAM · 800 beds",
    entry:
      "Handhelds on the clean-stock cage replaced Sunday clipboards. Nurses notice when carts are full; I notice when pieces go missing.",
  },
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    entryRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stories" className="bg-altimeter px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <p className="mb-4 text-[11px] font-semibold tracking-widest2 text-amber uppercase">
            Field notes
          </p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.08] text-navy italic">
            Written by operators.
            <br />
            <span className="font-semibold not-italic">Measured on the floor.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-navy/8 md:grid-cols-2">
          {logEntries.map((log, index) => (
            <div
              key={log.name}
              ref={(el) => {
                entryRefs.current[index] = el;
              }}
              className="log-entry bg-altimeter p-8 transition-colors duration-300 hover:bg-white"
              style={{ transitionDelay: `${(index % 2) * 0.1}s` }}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-bold tracking-widest2 text-amber uppercase">
                    {log.date}
                  </p>
                  <p className="text-[10px] font-medium tracking-wide text-brand-muted/60 uppercase">
                    {log.facilityLine}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-light text-navy">
                    {log.metric}
                  </p>
                  <p className="text-[10px] tracking-wide text-brand-muted/60 uppercase">
                    {log.metricCaption}
                  </p>
                </div>
              </div>

              <p className="font-display mb-6 text-[1.05rem] leading-relaxed text-navy/75 italic">
                &ldquo;{log.entry}&rdquo;
              </p>

              <div className="border-t border-navy/8 pt-5">
                <p className="text-sm font-semibold text-navy">{log.name}</p>
                <p className="mt-0.5 text-xs text-brand-muted/60">{log.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
