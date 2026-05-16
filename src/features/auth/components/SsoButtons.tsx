"use client";

import { toast } from "@/components/ui/toast";

/**
 * SsoButtons — visual SSO affordances for the auth pages.
 *
 * Phase 1 ships the visible buttons (the deal-unblocker for enterprise sales
 * conversations). Backend wiring happens in a separate PR.
 *
 * TODO(auth): wire Microsoft + Google providers (NextAuth, Auth0, Cognito,
 * etc.). When provisioned, replace the `onClick` handlers below to redirect
 * to the appropriate provider start URL.
 */

type SsoButtonsProps = {
  /** Verb used in button labels — "Continue" for login, "Sign up" for signup. */
  intent?: "login" | "signup";
};

export function SsoButtons({ intent = "login" }: SsoButtonsProps) {
  const verb = intent === "signup" ? "Sign up" : "Continue";

  const onClickStub = (provider: "Microsoft" | "Google") => {
    toast.info(`${provider} sign-in is coming soon. Use email for now.`);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onClickStub("Microsoft")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border border-border bg-[var(--surface)] px-4 text-sm font-medium text-foreground transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          aria-label={`${verb} with Microsoft`}
        >
          <MicrosoftLogo className="size-4" />
          {verb} with Microsoft
        </button>
        <button
          type="button"
          onClick={() => onClickStub("Google")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border border-border bg-[var(--surface)] px-4 text-sm font-medium text-foreground transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          aria-label={`${verb} with Google`}
        >
          <GoogleLogo className="size-4" />
          {verb} with Google
        </button>
      </div>

      <div className="flex items-center gap-3" aria-hidden>
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-[var(--tracking-widest2)] text-muted-foreground">
          {intent === "signup" ? "Or sign up with email" : "Or continue with email"}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="9.4" height="9.4" fill="#F25022" />
      <rect x="12.6" y="2" width="9.4" height="9.4" fill="#7FBA00" />
      <rect x="2" y="12.6" width="9.4" height="9.4" fill="#00A4EF" />
      <rect x="12.6" y="12.6" width="9.4" height="9.4" fill="#FFB900" />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18A10.98 10.98 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
