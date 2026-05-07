"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignupMutation } from "@/features/auth/api/authApi";

import { AuthPasswordField } from "./AuthPasswordField";
import { AuthShell } from "./AuthShell";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { isLoading, error }] = useSignupMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const user = await signup({ name, email, password }).unwrap();
      router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard");
    } catch {
      /* surfaced below */
    }
  }

  return (
    <AuthShell
      title={<>Create account</>}
      description={<>Join your team on LineTrack.</>}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-amber underline-offset-4 hover:text-amber-light hover:underline">
            Sign in
          </Link>
          {" · "}
          <Link href="/" className="underline-offset-4 hover:text-foreground hover:underline">
            Back to home
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            required
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            className="h-11 bg-background/80"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="h-11 bg-background/80"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="password">
            Password
          </label>
          <AuthPasswordField
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            Unable to create account. This email may already be registered, or the API may be unreachable.
          </p>
        )}
        <Button type="submit" variant="luxury" size="lg" className="h-11 w-full rounded-full" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
