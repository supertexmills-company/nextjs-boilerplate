"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

import AppImage from "@/marketing/components/ui/AppImage";

interface Program {
  id: string;
  title: string;
  subtitle: string;
  feeling: string;
  image: string;
  imageAlt: string;
  tag: string;
}

const programs: Program[] = [
  {
    id: "luxury-hotels",
    title: "Luxury hotels",
    subtitle: "Premium property operations",
    feeling:
      "Maintain full linen and uniform visibility across departments while improving service consistency for high-expectation guests.",
    image: "/marketing/programs/hotels-resorts.png",
    imageAlt: "Luxury hotel linen prepared for daily operations",
    tag: "Premium segment",
  },
  {
    id: "resorts",
    title: "Resorts",
    subtitle: "Multi-area coordination",
    feeling:
      "Coordinate textile movement across rooms, spas, pools, and F&B outlets with one operational view.",
    image: "/marketing/programs/hospitals-healthcare.png",
    imageAlt: "Resort operations team preparing textiles across guest services",
    tag: "Multi-zone control",
  },
  {
    id: "hotel-chains",
    title: "Hotel chains",
    subtitle: "Portfolio-wide governance",
    feeling:
      "Standardize operational oversight and performance benchmarks across properties while giving each site clear accountability.",
    image: "/marketing/programs/commercial-laundry.png",
    imageAlt: "Regional hospitality team reviewing multi-property operations",
    tag: "Portfolio insight",
  },
  {
    id: "hospitality-groups",
    title: "Hospitality groups",
    subtitle: "Operational intelligence layer",
    feeling:
      "Give finance and operations leaders one source of truth for inventory health, usage trends, and loss patterns.",
    image: "/marketing/programs/uniform-rental.png",
    imageAlt: "Hospitality group leadership reviewing operational intelligence metrics",
    tag: "Executive visibility",
  },
  {
    id: "laundry-partners",
    title: "Laundry operations providers",
    subtitle: "Service reliability and control",
    feeling:
      "Improve delivery reliability, reduce avoidable rework, and maintain transparent inventory accountability for hotel clients.",
    image: "/marketing/programs/commercial-laundry.png",
    imageAlt: "Laundry operations partner managing hospitality textile workflows",
    tag: "Service efficiency",
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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="programs" className="bg-[var(--porcelain)] px-6 py-28 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 md:mb-20">
          <p className="kicker mb-3">Use cases</p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-medium leading-[1.05] tracking-[var(--tracking-heading)] text-foreground">
            Built for hospitality organizations at every scale.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            From single luxury properties to multi-brand portfolios, the platform delivers operational clarity where cost
            leakage is hardest to see.
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
                className="program-card border-t border-border py-14 md:py-16"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div
                  className={`flex flex-col items-center gap-10 lg:gap-16 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="group relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[24px] border border-border lg:w-[52%]">
                    <AppImage
                      src={prog.image}
                      alt={prog.imageAlt}
                      fill
                      className="program-card-img h-full w-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 52vw"
                    />
                    <div className="absolute top-5 left-5">
                      <span className="rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[var(--surface)]">
                        {prog.tag}
                      </span>
                    </div>
                    {/* Brass corner accent on hover */}
                    <div className="pointer-events-none absolute right-0 top-0 size-16 origin-top-right scale-0 bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] transition-transform duration-500 group-hover:scale-100" aria-hidden />
                  </div>

                  <div className="flex flex-1 flex-col justify-center py-2">
                    <p className="kicker mb-1.5">{prog.subtitle}</p>
                    <h3 className="font-display mb-5 text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium leading-tight tracking-[var(--tracking-heading)] text-foreground">
                      {prog.title}
                    </h3>

                    <div className="mb-5 h-px w-12 bg-[var(--accent)]" />

                    <p className="mb-7 max-w-sm text-[17px] leading-relaxed text-muted-foreground">
                      {prog.feeling}
                    </p>

                    <a
                      href="#booking"
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-[var(--accent)]"
                    >
                      Request a tailored walkthrough
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
