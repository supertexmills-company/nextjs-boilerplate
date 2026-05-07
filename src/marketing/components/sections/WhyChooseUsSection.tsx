"use client";

import AppImage from "@/marketing/components/ui/AppImage";

interface ReasonItem {
  title: string;
  description: string;
}

const reasons: ReasonItem[] = [
  {
    title: "Consistent Quality",
    description:
      "Reliable home textile supply with standards buyers can trust across repeated orders.",
  },
  {
    title: "Flexible MOQs",
    description:
      "Low and negotiable minimum order quantities that make scaling easier for every buyer profile.",
  },
  {
    title: "Transparent Pricing",
    description:
      "Clear quotations with no hidden costs, helping teams budget with confidence.",
  },
  {
    title: "Global Trust",
    description:
      "Supplying buyers across UK, USA, Canada, and Australia with dependable service.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="bg-altimeter px-6 py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-navy/10 bg-white shadow-[0_24px_60px_rgba(7,19,39,0.12)]">
            <div className="relative aspect-[4/5]">
              <AppImage
                src="/marketing/programs/hotels-resorts.png"
                alt="Premium hospitality linen supply partnership"
                fill
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 36vw"
              />
            </div>
          </div>

          <div className="absolute -top-6 -right-2 rounded-3xl bg-navy px-8 py-7 text-altimeter shadow-[0_20px_40px_rgba(11,29,58,0.28)]">
            <p className="font-display text-5xl font-semibold leading-none">
              50+
            </p>
            <p className="mt-2 text-sm font-medium tracking-wide text-altimeter/80">
              Global Clients
            </p>
          </div>

          <div className="absolute -bottom-10 -left-4 hidden w-52 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_20px_50px_rgba(7,19,39,0.12)] md:block">
            <div className="relative aspect-[4/3]">
              <AppImage
                src="/marketing/programs/commercial-laundry.png"
                alt="Trusted sourcing partnership"
                fill
                className="h-full w-full object-cover"
                sizes="220px"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[11px] font-semibold tracking-widest2 text-amber uppercase">
            Why choose us
          </p>

          <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-light leading-[1.08] text-navy italic">
            ThreadLyne Global
            <br />
            <span className="font-semibold not-italic">
              Your Trusted Hotel Linen Supply Partner
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-brand-muted">
            Choosing the right hospitality linen supplier is about reliability,
            consistency, and trust. Our sourcing model is built around the
            values that matter most to global buyers.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {reasons.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-navy/10 bg-white/90 p-6 shadow-[0_10px_30px_rgba(7,19,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-amber/35 hover:shadow-[0_16px_34px_rgba(7,19,39,0.12)]"
              >
                <div className="mb-4 h-1.5 w-10 rounded-full bg-amber" />
                <h3 className="font-display text-2xl font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 text-base leading-relaxed text-brand-muted">
            With ThreadLyne Global, you gain a partner committed to simplifying
            linen sourcing with transparency and reliability.
          </p>
        </div>
      </div>
    </section>
  );
}
