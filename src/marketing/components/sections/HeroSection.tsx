"use client";

import { useEffect, useState } from "react";
import AppImage from "@/marketing/components/ui/AppImage";

const AUTO_ADVANCE_MS = 5800;

const heroSlides = [
  {
    src: "/marketing/hero/hero-main-1.jpeg",
    alt: "LineTrack linen operations at collection stage",
  },
  {
    src: "/marketing/hero/hero-main-2.jpeg",
    alt: "LineTrack laundry processing in motion",
  },
  {
    src: "/marketing/hero/hero-main-3.jpg",
    alt: "LineTrack textile handling and sorting workflow",
  },
  {
    src: "/marketing/hero/hero-main-4.jpg",
    alt: "LineTrack dispatch-ready linen inventory view",
  },
  {
    src: "/marketing/hero/hero-main.jpg",
    alt: "LineTrack facility-wide linen visibility",
  },
  {
    src: "/marketing/hero/hero-main-5.jpg",
    alt: "LineTrack operations dashboard background scene",
  },
];

const heroContent = [
  {
    eyebrow: "Linen Supply Partner",
    titleStart: "Reliable Linen.",
    titleHighlight: "Delivered Globally.",
    description:
      "From premium bed sheets to bath essentials, we help hospitality teams source with confidence, consistency, and speed.",
    primaryCta: { label: "Explore Our Collection", href: "#programs" },
    secondaryCta: { label: "Talk to Us", href: "#booking" },
  },
  {
    eyebrow: "Crafted For Hospitality",
    titleStart: "Comfort Guests Feel.",
    titleHighlight: "Quality Teams Trust.",
    description:
      "Engineered for daily commercial use, our linens balance softness, long life, and clean presentation across every room.",
    primaryCta: { label: "Explore Our Collection", href: "#programs" },
    secondaryCta: { label: "Talk to Us", href: "#booking" },
  },
  {
    eyebrow: "Smart Sourcing",
    titleStart: "One Partner",
    titleHighlight: "For Bed & Bath Linen.",
    description:
      "Simplify procurement with transparent pricing, dependable lead times, and options built for hotels, importers, and distributors.",
    primaryCta: { label: "Explore Our Collection", href: "#programs" },
    secondaryCta: { label: "Talk to Us", href: "#booking" },
  },
  {
    eyebrow: "Built For Operations",
    titleStart: "Consistent Stock.",
    titleHighlight: "Consistent Standards.",
    description:
      "Keep properties running smoothly with quality-controlled linen programs designed to reduce replacements and improve guest experience.",
    primaryCta: { label: "Explore Our Collection", href: "#programs" },
    secondaryCta: { label: "Talk to Us", href: "#booking" },
  },
  {
    eyebrow: "Global Hospitality Network",
    titleStart: "Scale Your Linen Supply",
    titleHighlight: "With Confidence.",
    description:
      "Whether you manage one property or many, we provide flexible ordering, responsive support, and reliable fulfillment.",
    primaryCta: { label: "Explore Our Collection", href: "#programs" },
    secondaryCta: { label: "Talk to Us", href: "#booking" },
  },
];

export default function HeroSection() {
  const [panelVisible, setPanelVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalSlides = heroSlides.length;
  const loopedSlides = [
    heroSlides[totalSlides - 1],
    ...heroSlides,
    heroSlides[0],
  ];
  const visualSlideIndex = ((activeSlide - 1 + totalSlides) % totalSlides + totalSlides) % totalSlides;
  const contentSlides = heroSlides.map((_, index) => heroContent[index % heroContent.length]);
  const loopedContentSlides = [
    contentSlides[totalSlides - 1],
    ...contentSlides,
    contentSlides[0],
  ];

  useEffect(() => {
    const timer = setTimeout(() => setPanelVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || totalSlides <= 1 || !isAutoPlaying) return;

    const interval = window.setInterval(() => {
      setActiveSlide((currentSlide) => currentSlide + 1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, totalSlides, isAutoPlaying]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsAutoPlaying(!document.hidden);
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleTrackTransitionEnd = () => {
    if (activeSlide === 0) {
      setIsAnimating(false);
      setActiveSlide(totalSlides);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsAnimating(true));
      });
      return;
    }

    if (activeSlide === totalSlides + 1) {
      setIsAnimating(false);
      setActiveSlide(1);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsAnimating(true));
      });
    }
  };

  const trackTransitionClass =
    prefersReducedMotion || !isAnimating
      ? "transition-none"
      : "will-change-transform transition-transform duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
  const trackTransform = `translate3d(-${activeSlide * 100}%, 0, 0)`;

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div
          className={`flex h-full w-full ${trackTransitionClass}`}
          style={{ transform: trackTransform }}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {loopedSlides.map((slide, index) => (
            <div key={`${slide.src}-${index}`} className="relative h-full w-full shrink-0">
              <AppImage
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 1}
                className="h-full w-full object-cover object-center"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="hero-overlay absolute inset-0" />
      <div
        className={`absolute bottom-0 left-0 w-full transition-opacity duration-[1500ms] ${
          panelVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(7,19,39,0.92) 0%, rgba(7,19,39,0.4) 60%, transparent 100%)",
        }}
      >
        <div className="pointer-events-none absolute bottom-0 left-0 flex w-full select-none items-end justify-center pb-6">
          <div className="flex items-center gap-3 opacity-45">
            {heroSlides.map((slide, i) => (
              <div
                key={slide.src}
                className={`rounded-full border border-altimeter/70 transition-all ${
                  i === visualSlideIndex ? "bg-altimeter/90" : "bg-transparent"
                }`}
                style={{
                  width: i === visualSlideIndex ? "40px" : "10px",
                  height: "10px",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-6">
        <div
          className={["flex w-full", trackTransitionClass].join(" ")}
          style={{ transform: trackTransform }}
        >
          {loopedContentSlides.map((content, index) => (
            <div key={`content-${index}`} className="flex w-full shrink-0 justify-center text-center">
              <div className="flex max-w-4xl flex-col items-center">
                <p className="hero-headline mb-6 font-sans text-[11px] font-semibold tracking-widest2 text-amber uppercase">
                  {content.eyebrow}
                </p>

                <h1 className="hero-headline font-display max-w-3xl text-[clamp(2.4rem,6vw,5.2rem)] font-light leading-[1.05] text-altimeter italic">
                  {content.titleStart}
                  <br />
                  <span className="font-semibold not-italic">{content.titleHighlight}</span>
                </h1>

                <p className="hero-sub mt-6 max-w-lg font-sans text-[clamp(1rem,2vw,1.2rem)] font-light leading-relaxed text-altimeter/70">
                  {content.description}
                </p>

                <div className="hero-cta mt-10 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
                  <a href={content.primaryCta.href} className="btn-amber rounded-full px-9 py-4 text-[14px]">
                    {content.primaryCta.label}
                  </a>
                  <a
                    href={content.secondaryCta.href}
                    className="btn-ghost rounded-full border-altimeter/40 px-9 py-4 text-[14px] text-altimeter hover:bg-altimeter hover:text-navy"
                  >
                    {content.secondaryCta.label}
                  </a>
                  <a
                    href="/login"
                    className="btn-ghost rounded-full border-altimeter/40 px-9 py-4 text-[14px] text-altimeter hover:bg-altimeter hover:text-navy"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-cta pointer-events-none absolute right-5 bottom-8 z-20 flex flex-col items-center gap-3 sm:right-8 sm:bottom-10 lg:right-12 lg:bottom-12">
        <span className="text-[10px] font-medium tracking-widest2 text-altimeter/40 uppercase">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden bg-altimeter/15">
          <div className="scroll-drop absolute top-0 left-0 h-1/3 w-full bg-amber" />
        </div>
      </div>
    </section>
  );
}
