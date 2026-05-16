"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignupMutation } from "@/features/auth/api/authApi";

import { AuthPasswordField } from "./AuthPasswordField";
import { AuthShell } from "./AuthShell";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [signup, { isLoading, error }] = useSignupMutation();

  const nameError = touched.name && name.trim().length < 2 ? "Please enter your name." : undefined;
  const emailError = touched.email && !isEmail(email) ? "Enter a valid email address." : undefined;
  const passwordError =
    touched.password && password.length < 8 ? "Use at least 8 characters for a stronger password." : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (name.trim().length < 2 || !isEmail(email) || password.length < 8) return;
    try {
      const user = await signup({ name, email, password }).unwrap();
      router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard");
    } catch {
      /* surfaced below */
    }
  }

  return (
    <AuthShell
      title="Create account"
      description="Join your team on Tantava."
      topRight={
        <Link href="/login" className="font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          Sign in instead
        </Link>
      }
      footer={
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our operator terms and privacy practices.
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Name" htmlFor="name" error={nameError}>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            required
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={Boolean(nameError) || undefined}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={emailError}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={Boolean(emailError) || undefined}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={passwordError} helper="At least 8 characters.">
          <AuthPasswordField
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            aria-invalid={Boolean(passwordError) || undefined}
          />
        </Field>
        {error && (
          <p
            className="rounded-[14px] border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] px-4 py-3 text-sm text-[var(--danger)]"
            role="alert"
          >
            Unable to create account. This email may already be registered, or the API may be unreachable.
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
