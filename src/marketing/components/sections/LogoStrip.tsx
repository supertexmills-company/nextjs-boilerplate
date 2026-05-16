"use client";

import { useEffect, useRef, useState } from "react";

import { customerLogos } from "@/marketing/content/marketing-content";

/**
 * LogoStrip — a quiet row of customer logos placed directly below the hero.
 *
 * Each entry tries to render the SVG at `src`. If the file is missing
 * (placeholder period), it gracefully falls back to a typographic wordmark
 * using the customer `name`. This means the strip looks coherent even before
 * real logos are dropped into /public/marketing/logos/.
 *
 * Replace the placeholder entries in marketing-content.ts → `customerLogos`
 * with real grayscale SVGs to ship.
 */
export default function LogoStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (customerLogos.length === 0) return null;

  return (
    <section
      aria-label="Operating across leading hospitality brands"
      className="border-b border-border bg-[var(--surface)] px-6 py-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="kicker mb-6 text-center text-[var(--text-soft)]">
          Operating across leading hospitality brands
        </p>
        <div
          ref={ref}
          className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14 transition-opacity duration-700 ease-[var(--ease)] ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          {customerLogos.map((logo) => (
            <LogoCell key={logo.name} name={logo.name} src={logo.src} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoCell({ name, src }: { name: string; src: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span
        aria-label={name}
        className="font-display text-[15px] font-semibold uppercase tracking-[var(--tracking-widest2)] text-[color-mix(in_srgb,var(--text)_38%,transparent)] grayscale"
      >
        {name}
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={name}
      width={120}
      height={28}
      loading="lazy"
      onError={() => setErrored(true)}
      className="h-7 w-auto grayscale opacity-60 transition-opacity duration-200 hover:opacity-90"
    />
  );
}
