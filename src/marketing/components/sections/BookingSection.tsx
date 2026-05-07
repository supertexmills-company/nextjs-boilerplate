"use client";

import { useState } from "react";
import AppIcon from "@/marketing/components/ui/AppIcon";

interface DemoRequestForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  motivation: string;
}

export default function BookingSection() {
  const [form, setForm] = useState<DemoRequestForm>({
    name: "",
    company: "",
    email: "",
    phone: "",
    motivation: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [emailCapture, setEmailCapture] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
  };

  return (
    <section id="booking" className="booking-bg px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14">
          <p className="mb-4 text-[11px] font-semibold tracking-widest2 text-amber uppercase">
            Talk to sales
          </p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.08] text-altimeter italic">
            Book a demo
          </h2>
          <p className="mt-4 max-w-xl text-lg font-light leading-relaxed text-haze/60">
            Walk through   tagging, portal placement, handheld workflows, and
            the LineTrack dashboard with our solutions team. Bring your site list
            and volume assumptions — we will keep it concrete.
          </p>

          <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-amber/25 bg-amber/10 px-7 py-4">
            <div>
              <p className="mb-1 text-[11px] font-semibold tracking-widest2 text-amber uppercase">
                Enterprise rollout
              </p>
              <p className="font-display text-3xl font-semibold text-altimeter">
                Scoped
              </p>
            </div>
            <div className="h-10 w-px bg-haze/15" />
            <div>
              <p className="max-w-[220px] text-sm font-light leading-snug text-haze/60">
                Pricing follows sites, tag volume, and integration depth. We will
                confirm scope after the first call — no pressure on the demo.
              </p>
            </div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[12px] font-semibold tracking-wide text-haze/60 uppercase">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jordan Lee"
                  required
                  className="input-field w-full rounded-xl px-5 py-3.5 text-sm font-medium"
                />
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-semibold tracking-wide text-haze/60 uppercase">
                  Work email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className="input-field w-full rounded-xl px-5 py-3.5 text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[12px] font-semibold tracking-wide text-haze/60 uppercase">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Organization name"
                  required
                  className="input-field w-full rounded-xl px-5 py-3.5 text-sm font-medium"
                />
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-semibold tracking-wide text-haze/60 uppercase">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (415) 000-0000"
                  className="input-field w-full rounded-xl px-5 py-3.5 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-semibold tracking-wide text-haze/60 uppercase">
                Scope (sites, volumes, systems)
              </label>
              <textarea
                name="motivation"
                value={form.motivation}
                onChange={handleChange}
                placeholder="Rough site count, pounds or pieces per week, ERP or PMS, and what you need to prove on day one."
                rows={3}
                className="textarea-field w-full rounded-xl px-5 py-3.5 text-sm font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-amber w-full rounded-full px-12 py-4 text-[15px] font-semibold md:w-auto"
              >
                Request a demo
              </button>
              <p className="mt-3 text-xs font-light text-haze/40">
                No payment on this form — we confirm the calendar invite by email,
                usually within one business day.
              </p>
            </div>
          </form>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber/30 bg-amber/15">
              <AppIcon name="CheckIcon" size={28} className="text-amber" />
            </div>
            <h3 className="font-display mb-3 text-2xl font-semibold text-altimeter">
              Request received.
            </h3>
            <p className="mx-auto max-w-sm font-light text-haze/60">
              Our team will review your details and send a calendar invite.
              Check your inbox for next steps.
            </p>
          </div>
        )}

        <div id="email-capture" className="email-capture-bg mt-20 rounded-2xl p-8">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            <div className="flex-1">
              <p className="mb-2 text-[11px] font-semibold tracking-widest2 text-amber uppercase">
                Not ready to meet?
              </p>
              <h3 className="font-display mb-2 text-xl font-semibold text-altimeter">
                Platform overview PDF
              </h3>
              <p className="max-w-sm text-sm font-light leading-relaxed text-haze/55">
                Hardware footprint, integration touchpoints, and a sample rollout
                timeline — formatted for operations and procurement reviews.
              </p>
            </div>
            {!emailSubmitted ? (
              <form
                onSubmit={handleEmailSubmit}
                className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
              >
                <input
                  type="email"
                  value={emailCapture}
                  onChange={(e) => setEmailCapture(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="input-field w-full rounded-full px-5 py-3 text-sm font-medium sm:w-64"
                />
                <button
                  type="submit"
                  className="btn-amber shrink-0 rounded-full px-7 py-3 text-sm font-semibold whitespace-nowrap"
                >
                  brochure
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 text-amber">
                <AppIcon name="CheckCircleIcon" size={20} />
                <span className="text-sm font-semibold">
                  Overview on its way to your inbox.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
