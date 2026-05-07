"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/features/auth/api/authApi";

import { AuthPasswordField } from "./AuthPasswordField";
import { AuthShell } from "./AuthShell";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const user = await login({ email, password }).unwrap();
      router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard");
    } catch {
      /* surfaced below */
    }
  }

  return (
    <AuthShell
      title={<>Sign in</>}
      description={<>Use your LineTrack operator account.</>}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="font-medium text-amber underline-offset-4 hover:text-amber-light hover:underline">
            Create an account
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
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            Unable to sign in. Check your credentials and that the API is reachable.
          </p>
        )}
        <Button type="submit" variant="luxury" size="lg" className="h-11 w-full rounded-full" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
