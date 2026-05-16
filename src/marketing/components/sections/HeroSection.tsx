"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import AppImage from "@/marketing/components/ui/AppImage";

const AUTO_ADVANCE_MS = 6000;

const heroSlides = [
  {
    src: "/marketing/hero/hero-main-1.jpeg",
    alt: "Hotel operations team coordinating linen workflows",
  },
  {
    src: "/marketing/hero/hero-main-2.jpeg",
    alt: "Premium hospitality back-of-house textile operations",
  },
  {
    src: "/marketing/hero/hero-main-3.jpg",
    alt: "Hotel department textile movement and handling",
  },
  {
    src: "/marketing/hero/hero-main-4.jpg",
    alt: "Organized linen inventory prepared for distribution",
  },
  {
    src: "/marketing/hero/hero-main.jpg",
    alt: "Cross-department visibility into hospitality textiles",
  },
];

/**
 * HeroSection — single Tantava narrative, image carousel only.
 * Drops the 5-variant content rotation and the second translation track.
 */
export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const total = heroSlides.length;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVis = () => setIsVisible(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (prefersReducedMotion || total <= 1 || !isVisible) return;
    intervalRef.current = window.setInterval(advance, AUTO_ADVANCE_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [advance, prefersReducedMotion, total, isVisible]);

  const goTo = (idx: number) => {
    setActive(idx);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (!prefersReducedMotion && isVisible) {
      intervalRef.current = window.setInterval(advance, AUTO_ADVANCE_MS);
    }
  };

  return (
    <section
      className="relative h-screen min-h-[700px] w-full overflow-hidden pt-24"
      aria-roledescription="carousel"
      aria-label="Hospitality operations imagery"
    >
      {/* Image layer — cross-fade only, no translation */}
      <div className="absolute inset-0 h-full w-full">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.src}
            className="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-[var(--ease)]"
            style={{ opacity: idx === active ? 1 : 0 }}
            aria-hidden={idx !== active}
          >
            <AppImage
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              className="h-full w-full object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="hero-overlay absolute inset-0" aria-hidden />

      {/* Single static content — no rotation */}
      <div className="absolute inset-0 flex items-start justify-center px-6 pt-28 sm:pt-32 md:pt-36">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="hero-headline font-display max-w-3xl text-[clamp(2.2rem,5.3vw,4.8rem)] font-medium leading-[1.06] tracking-[var(--tracking-display)] text-[var(--surface)]">
            Complete visibility for
            <br />
            <span className="text-[var(--accent-soft)]">hotel linen &amp; textile operations.</span>
          </h1>

          <p className="hero-sub mt-7 max-w-xl text-[clamp(0.98rem,1.35vw,1.12rem)] leading-relaxed text-[color-mix(in_srgb,var(--surface)_82%,var(--text-soft))]">
            A premium operations intelligence platform that helps hotels track linen and uniforms in real time, reduce
            losses, and improve margins with confidence.
          </p>

          <div className="hero-cta mt-9 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
            <a href="#booking" className="btn-amber inline-flex items-center gap-2 rounded-[16px] px-7 py-3.5 text-[14px]">
              Request demo <ArrowRight className="size-4" />
            </a>
            <a
              href="#stories"
              className="rounded-[16px] border border-[color-mix(in_srgb,var(--surface)_50%,transparent)] px-7 py-3.5 text-[14px] font-medium text-[var(--surface)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_20%,transparent)]"
            >
              See business impact
            </a>
          </div>
        </div>
      </div>

      {/* Pagination — interactive dots */}
      <div className="absolute bottom-8 left-0 w-full">
        <div
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--surface)_35%,transparent)] bg-[color-mix(in_srgb,var(--surface)_22%,transparent)] px-3 py-2 backdrop-blur"
          role="tablist"
          aria-label="Hero slides"
        >
          {heroSlides.map((slide, i) => {
            const isActive = i === active;
            return (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Show slide ${i + 1} of ${total}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ease-[var(--ease)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brass-glow)] ${
                  isActive
                    ? "w-9 bg-[var(--accent)]"
                    : "w-2 bg-[color-mix(in_srgb,var(--surface)_35%,transparent)] hover:bg-[color-mix(in_srgb,var(--surface)_65%,transparent)]"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-cta pointer-events-none absolute right-5 bottom-8 z-10 hidden flex-col items-center gap-3 sm:right-8 sm:bottom-10 sm:flex">
        <span className="text-[10px] font-medium uppercase tracking-[var(--tracking-widest2)] text-[color-mix(in_srgb,var(--surface)_70%,transparent)]">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden bg-[color-mix(in_srgb,var(--surface)_25%,transparent)]">
          <div className="scroll-drop absolute top-0 left-0 h-1/3 w-full bg-[var(--accent)]" />
        </div>
      </div>
    </section>
  );
}
