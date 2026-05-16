"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/features/auth/components/AuthShell";

/**
 * /forgot-password — visible affordance for password recovery.
 *
 * Ships with a static success-state so the route is present and discoverable
 * from the login page (required for enterprise sales conversations and for
 * users who actually forget their password).
 *
 * TODO(api): wire to the backend endpoint that triggers a reset email
 * (e.g. POST /auth/forgot-password). Until then, submit shows the generic
 * success copy regardless of input — which is also the recommended UX to
 * avoid leaking which emails are registered.
 */

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailError = touched && !isEmail(email) ? "Enter a valid email address." : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isEmail(email)) return;

    setSubmitting(true);
    // TODO(api): replace with a real call once /auth/forgot-password is live.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <AuthShell
      title="Reset password"
      description="Enter the email on your operator account and we'll send a reset link."
      topRight={
        <Link
          href="/login"
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      }
      footer={
        <p className="text-center text-xs text-muted-foreground">
          Need help signing in? Email{" "}
          <a className="font-medium text-[var(--accent)] underline-offset-4 hover:underline" href="mailto:support@tantava.io">
            support@tantava.io
          </a>
          .
        </p>
      }
    >
      {!submitted ? (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Field label="Email" htmlFor="forgot-email" error={emailError}>
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={Boolean(emailError) || undefined}
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send reset link"}
            {!submitting ? <ArrowRight className="size-4" /> : null}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            For your security, we send the same response whether or not an account exists for this email.
          </p>
        </form>
      ) : (
        <div className="py-6 text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)]">
            <CheckCircle2 className="size-5 text-[var(--accent)]" />
          </div>
          <h2 className="font-display text-2xl font-medium text-foreground">Check your inbox</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, we&apos;ve
            sent reset instructions. The link expires in 30 minutes.
          </p>
          <div className="mt-7">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Back to sign in <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
