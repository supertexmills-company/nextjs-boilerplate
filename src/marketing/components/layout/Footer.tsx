"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import AppLogo from "@/marketing/components/ui/AppLogo";

const solutions = [
  { label: "Luxury hotels", href: "#programs" },
  { label: "Resorts", href: "#programs" },
  { label: "Hotel chains", href: "#programs" },
  { label: "Hospitality groups", href: "#programs" },
];

const company = [
  { label: "How it works", href: "#journey" },
  { label: "ROI and insights", href: "#stories" },
  { label: "Request demo", href: "#booking" },
  { label: "Sign in", href: "/login" },
];

const support = [
  { label: "Contact sales", href: "#booking" },
  { label: "Pricing plans", href: "#booking" },
  { label: "Privacy policy", href: "#" },
  { label: "Terms of service", href: "#" },
];

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="kicker mb-4 text-foreground">{title}</p>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="border-t border-border bg-[var(--porcelain)]">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 md:pt-24">
        {/* Newsletter band */}
        <div className="mb-16 grid gap-6 rounded-[24px] border border-border bg-[var(--surface)] p-8 shadow-[var(--e1)] md:grid-cols-2 md:items-center md:gap-10 md:p-10">
          <div className="space-y-2">
            <p className="kicker">Stay in touch</p>
            <h3 className="font-display text-[36px] font-medium leading-[1] tracking-[var(--tracking-display)] text-foreground md:text-[44px]">
              Hospitality operations brief
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Quarterly insights on inventory efficiency, cost control, and operational excellence for hotel leadership
              teams.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubmitted(true);
            }}
          >
            <label className="sr-only" htmlFor="footer-newsletter">
              Email address
            </label>
            <input
              id="footer-newsletter"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hotel.com"
              className="flex-1 rounded-[16px] border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-[color-mix(in_srgb,var(--accent)_60%,var(--border))] focus:outline-none focus:ring-[3px] focus:ring-[var(--ring)]"
            />
            <button type="submit" className="btn-amber inline-flex items-center justify-center gap-2 rounded-[16px] px-6 py-3 text-sm">
              {submitted ? (
                <>
                  <CheckCircle2 className="size-4" /> Subscribed
                </>
              ) : (
                <>
                  Subscribe <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1 lg:max-w-sm">
            <Link href="/" className="mb-5 inline-flex items-center" aria-label="Tantava">
              <AppLogo size={32} text="Tantava" />
            </Link>
            <p className="text-sm font-normal leading-relaxed text-muted-foreground">
              Built for large-scale hospitality operations seeking complete visibility, stronger control, and better
              inventory efficiency.
            </p>
          </div>

          <FooterLinkList title="Solutions" links={solutions} />
          <FooterLinkList title="Company" links={company} />
          <FooterLinkList title="Support" links={support} />
        </div>

        <div className="mt-14 border-t border-border pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tantava. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
