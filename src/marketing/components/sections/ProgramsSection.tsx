"use client";

import { useEffect, useRef } from "react";
import AppImage from "@/marketing/components/ui/AppImage";

interface Program {
  id: string;
  rating: string;
  subtitle: string;
  hours: string;
  hoursLabel: string;
  feeling: string;
  image: string;
  imageAlt: string;
  tag: string;
}

const programs: Program[] = [
  {
    id: "hotels",
    rating: "Hotels & resorts",
    subtitle: "Housekeeping & PAR",
    hours: "PAR",
    hoursLabel: "levels · loss control",
    feeling:
      "Housekeeping sees live par levels by floor and tower. Missing pool towels and robe shrinkage stop being a monthly surprise in P&L.",
    image: "/marketing/programs/hotels-resorts.png",
    imageAlt:
      "Stacks of white hotel towels and folded terry cloth on shelves, ready for room replenishment",
    tag: "Most requested",
  },
  {
    id: "healthcare",
    rating: "Hospitals & clinics",
    subtitle: "Hygiene traceability",
    hours: "Gowns",
    hoursLabel: "sheets · scrubs · isolation sets",
    feeling:
      "Track gowns and linen through laundry, sterile storage, and patient zones. Support infection-control rounds with item-level history, not clipboards.",
    image: "/marketing/programs/hospitals-healthcare.png",
    imageAlt:
      "Bright, calm hospital corridor suggesting clinical linen logistics and facility operations",
    tag: "Compliance-ready",
  },
  {
    id: "laundry",
    rating: "Commercial laundry",
    subtitle: "Plant throughput",
    hours: "Chutes",
    hoursLabel: "sort lanes · dispatch",
    feeling:
      "  at tunnel washers, sortation, and dispatch validates customer SKUs and catches mis-sorts before trailers leave the gate.",
    image: "/marketing/programs/commercial-laundry.png",
    imageAlt:
      "Industrial laundry setting with washing equipment and processed textiles in motion",
    tag: "Throughput",
  },
  {
    id: "rental",
    rating: "Rental & uniforms",
    subtitle: "Workwear programs",
    hours: "Renters",
    hoursLabel: "routes · returns",
    feeling:
      "Textile rental and uniform programs get delivery accuracy, damage accountability, and contract billing backed by scan events, not estimates.",
    image: "/marketing/programs/uniform-rental.png",
    imageAlt:
      "Warehouse shelving with boxed goods suggesting distribution, returns, and multi-site logistics",
    tag: "Route-ready",
  },
];

export default function ProgramsSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="programs" className="bg-altimeter px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-20">
          <p className="mb-4 text-[11px] font-semibold tracking-widest2 text-amber uppercase">
            Industry solutions
          </p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.08] text-navy italic">
            One platform.
            <br />
            <span className="font-semibold not-italic">Four operating contexts.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg font-light leading-relaxed text-brand-muted">
            LineTrack   is built for operators who move linen and garments at
            scale — with the same dashboards for owners, laundry managers, and
            site leads.
          </p>
        </div>

        <div className="flex flex-col gap-0">
          {programs.map((prog, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={prog.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="program-card border-t border-navy/8 py-16"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`flex flex-col items-center gap-10 lg:gap-16 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl lg:w-[52%]">
                    <AppImage
                      src={prog.image}
                      alt={prog.imageAlt}
                      fill
                      className="program-card-img h-full w-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 52vw"
                    />

                    <div className="absolute top-5 left-5">
                      <span className="rounded-full bg-amber px-4 py-1.5 text-[11px] font-semibold tracking-wide text-navy-deep">
                        {prog.tag}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-center py-2">
                    <div className="mb-1 flex items-baseline gap-3">
                      <span className="text-[11px] font-semibold tracking-widest2 text-amber uppercase">
                        {prog.subtitle}
                      </span>
                    </div>
                    <h3 className="font-display mb-2 text-[clamp(1.8rem,3.5vw,3rem)] font-semibold leading-tight text-navy">
                      {prog.rating}
                    </h3>

                    <div className="mb-6 flex items-center gap-2">
                      <span className="font-display text-3xl font-light text-amber">
                        {prog.hours}
                      </span>
                      <span className="text-sm font-medium text-brand-muted">
                        {prog.hoursLabel}
                      </span>
                    </div>

                    <div className="mb-6 h-px w-12 bg-amber" />

                    <p className="font-display mb-8 max-w-sm text-[1.15rem] leading-relaxed text-navy/70 italic">
                      &ldquo;{prog.feeling}&rdquo;
                    </p>

                    <a
                      href="#booking"
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-amber"
                    >
                      <span>Talk to sales</span>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
