"use client";

import { CheckCircle2 } from "lucide-react";

import AppImage from "@/marketing/components/ui/AppImage";

interface ReasonItem {
  title: string;
  description: string;
}

const reasons: ReasonItem[] = [
  {
    title: "Operational blind spots",
    description:
      "Teams often lose visibility once items move across departments, creating hidden losses that grow unnoticed.",
  },
  {
    title: "Manual tracking burden",
    description:
      "Spreadsheets, audits, and fragmented reporting consume valuable time and still leave room for costly errors.",
  },
  {
    title: "Replacement cost leakage",
    description:
      "Unclear usage and lifecycle data causes avoidable purchases and unnecessary replacement spend.",
  },
  {
    title: "Lack of control at scale",
    description:
      "As properties grow, leaders struggle to maintain consistent standards and accountability across locations.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="bg-[var(--porcelain)] px-6 py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-[var(--linen)] shadow-[var(--e2)]">
            <div className="relative aspect-[4/5]">
              <AppImage
                src="/marketing/programs/hotels-resorts.png"
                alt="Premium hospitality textile partnership"
                fill
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 36vw"
              />
            </div>
            {/* Anchored brass chip — inside image frame */}
            <div className="absolute bottom-5 left-5 rounded-[18px] border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[var(--surface)]/92 px-6 py-5 text-[var(--text)] shadow-[var(--e2)] backdrop-blur">
              <p className="font-display text-4xl font-semibold leading-none text-[var(--accent)]">50+</p>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[var(--tracking-widest2)] text-[var(--text-soft)]">
                Global clients
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="kicker mb-3">The problem</p>

          <h2 className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.05] tracking-[var(--tracking-heading)] text-foreground">
            Hotel textile operations are often managed with limited visibility.
          </h2>

          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            When inventory movement cannot be seen clearly, losses rise quietly, audits become manual, and operational
            decisions are delayed. The result is higher cost and lower control.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {reasons.map((item) => (
              <article
                key={item.title}
                className="luxury-card group p-6 transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--border))]"
              >
                <div className="mb-4 flex size-9 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
                  <CheckCircle2 className="size-4" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-xl font-medium tracking-[var(--tracking-heading)] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[22px] border border-[color-mix(in_srgb,var(--accent)_24%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_6%,var(--surface))] p-6">
            <p className="kicker mb-2">The solution</p>
            <p className="font-display text-[1.35rem] leading-tight text-foreground">
              A real-time hotel operations intelligence platform for complete visibility and control.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Monitor linen, uniforms, and textile assets across operations, detect abnormal patterns early, and
              improve inventory decisions with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
