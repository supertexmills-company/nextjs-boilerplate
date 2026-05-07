"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: "35%", label: "Typical linen loss reduction" },
  { value: "99.2%", label: "Inventory accuracy (target)" },
  { value: "10×", label: "Faster bulk counting vs manual" },
  { value: "≤1 day", label: "Typical site audit window" },
  { value: "Multi-site", label: "One operations dashboard" },
];

export default function CredibilityBar() {
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-y border-haze/5 bg-navy-deep px-6 py-12">
      <div
        ref={ref}
        className="reveal-section mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-5"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="text-center"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <p className="font-display mb-1 text-[1.9rem] font-semibold leading-none text-amber">
              {stat.value}
            </p>
            <p className="text-[11px] font-medium tracking-wide text-haze/50 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
