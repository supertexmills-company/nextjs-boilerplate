"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, Check, Clock, ShieldCheck } from "lucide-react";

interface DemoRequestForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  motivation: string;
}

const checklistItems = [
  {
    icon: ShieldCheck,
    title: "Executive product walkthrough",
    body: "A focused review of inventory visibility, usage insights, and operational control workflows.",
  },
  {
    icon: Clock,
    title: "ROI and rollout planning",
    body: "We align on priority properties, expected impact, and a practical adoption path for your organization.",
  },
  {
    icon: CalendarCheck,
    title: "Consultative discussion",
    body: "Bring your goals and current constraints. We keep the conversation concrete, concise, and business-focused.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    fit: "Small hotels",
    description: "For single-property teams building foundational operational visibility.",
  },
  {
    name: "Professional",
    fit: "Growing hotels",
    description: "For multi-property groups standardizing control and improving operational efficiency.",
    highlight: true,
  },
  {
    name: "Enterprise",
    fit: "Hotel chains",
    description: "For large portfolios requiring governance, performance consistency, and executive oversight.",
  },
];

export default function BookingSection() {
  const [form, setForm] = useState<DemoRequestForm>({
    name: "",
    company: "",
    email: "",
    phone: "",
    motivation: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="booking" className="booking-bg relative px-6 py-28 md:py-32">
      <div className="relative z-[1] mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="kicker mb-3">Pricing</p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium leading-[1.02] tracking-[var(--tracking-display)] text-[var(--text)]">
            Flexible plans for every stage of hotel growth.
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[var(--text-soft)]">
            ROI is typically significantly higher than subscription cost, especially where replacement spend and
            operational leakage are already high.
          </p>
        </div>

        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`rounded-[20px] border p-6 shadow-[var(--e1)] ${
                tier.highlight
                  ? "border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))]"
                  : "border-border bg-[var(--surface)]"
              }`}
            >
              <p className="kicker mb-2">{tier.fit}</p>
              <h3 className="font-display text-[1.8rem] leading-tight text-foreground">{tier.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tier.description}</p>
            </article>
          ))}
        </div>

        <div className="mb-10 rounded-[20px] border border-[color-mix(in_srgb,var(--accent)_30%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_7%,var(--surface))] p-6 md:p-7">
          <p className="font-display text-[1.45rem] leading-tight text-foreground">
            Gain complete visibility and control over your hotel operations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="#booking" className="btn-amber inline-flex items-center gap-2 rounded-[16px] px-6 py-3 text-sm">
              Request Demo <ArrowRight className="size-4" />
            </a>
            <a
              href="#booking"
              className="inline-flex items-center rounded-[16px] border border-border bg-[var(--surface)] px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-[var(--surface-2)]"
            >
              Talk to Sales
            </a>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          {/* Form */}
          <div className="luxury-card relative overflow-hidden p-7 md:p-10">
            <p className="kicker mb-3">Request demo</p>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldLabel label="Full name">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jordan Lee"
                      required
                      className="input-field w-full rounded-[16px] px-4 py-3 text-[15px]"
                    />
                  </FieldLabel>
                  <FieldLabel label="Work email">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                      className="input-field w-full rounded-[16px] px-4 py-3 text-[15px]"
                    />
                  </FieldLabel>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldLabel label="Company">
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Organization name"
                      required
                      className="input-field w-full rounded-[16px] px-4 py-3 text-[15px]"
                    />
                  </FieldLabel>
                  <FieldLabel label="Phone (optional)">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (415) 000-0000"
                      className="input-field w-full rounded-[16px] px-4 py-3 text-[15px]"
                    />
                  </FieldLabel>
                </div>

                <FieldLabel label="Scope (sites, volumes, systems)">
                  <textarea
                    name="motivation"
                    value={form.motivation}
                    onChange={handleChange}
                    placeholder="Share your property count, current challenges, and the outcomes your team wants to achieve."
                    rows={3}
                    className="textarea-field w-full rounded-[16px] px-4 py-3 text-[15px]"
                  />
                </FieldLabel>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-[16px] px-9 py-3.5 text-[15px] font-semibold md:w-auto"
                  >
                    Request a demo <ArrowRight className="size-4" />
                  </button>
                  <p className="mt-3 text-xs text-[var(--text-soft)]">
                    No commitment required. We confirm your calendar invite by email, usually within one business day.
                  </p>
                </div>
              </form>
            ) : (
              <div className="py-14 text-center">
                <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)]">
                  <Check className="size-6 text-[var(--accent)]" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-medium text-[var(--text)]">Request received</h3>
                <p className="mx-auto max-w-sm text-[var(--text-soft)]">
                  Our team will review your details and send a calendar invite. Check your inbox for next steps.
                </p>
              </div>
            )}
          </div>

          {/* What to expect */}
          <aside className="space-y-5">
            <p className="kicker">What to expect</p>
            <ul className="space-y-4">
              {checklistItems.map((item) => (
                <li key={item.title} className="flex gap-4 rounded-[18px] border border-border bg-[var(--surface)] p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
                    <item.icon className="size-4.5" strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="font-display text-base font-medium text-[var(--text)]">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-soft)]">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-[18px] border border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] p-5">
              <p className="kicker mb-1">Enterprise confidence</p>
              <p className="font-display text-[20px] font-medium text-[var(--text)]">Purpose-built for hospitality leaders.</p>
              <p className="mt-1.5 text-sm text-[var(--text-soft)]">
                Designed for operational excellence in premium hotel groups with clear value from day one.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-[var(--text-soft)]">{label}</span>
      {children}
    </label>
  );
}
