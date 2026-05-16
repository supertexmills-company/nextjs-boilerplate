"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/features/auth/api/authApi";

import { AuthPasswordField } from "./AuthPasswordField";
import { AuthShell } from "./AuthShell";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [login, { isLoading, error }] = useLoginMutation();

  const emailError = touched.email && !isEmail(email) ? "Enter a valid email address." : undefined;
  const passwordError = touched.password && password.length < 6 ? "Password is at least 6 characters." : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isEmail(email) || password.length < 6) return;
    try {
      const user = await login({ email, password }).unwrap();
      router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard");
    } catch {
      /* surfaced below */
    }
  }

  return (
    <AuthShell
      title="Sign in"
      description="Use your Tantava operator account."
      topRight={
        <Link
          href="/signup"
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Create account
        </Link>
      }
      footer={
        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our operator terms and privacy practices.
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Email" htmlFor="email" error={emailError}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={Boolean(emailError) || undefined}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={passwordError}>
          <AuthPasswordField
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
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
            Unable to sign in. Check your credentials and that the API is reachable.
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
