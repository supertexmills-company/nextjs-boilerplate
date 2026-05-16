"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  History,
  LayoutDashboard,
  MapPin,
  Package,
  ScanLine,
  Search,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { BrandMark } from "@/marketing/components/ui/BrandMark";
import { SampleBanner } from "@/features/dashboard/components/SampleBanner";
import { cn } from "@/lib/utils";

/**
 * (sample)/sample/dashboard layout — a stripped-down dashboard shell rendered
 * for the public sample route. Crucially:
 *  - Does NOT call useGetMeQuery (no session required).
 *  - Sidebar items are non-navigating buttons that toast "Sign up to use".
 *  - Pinned SampleBanner at the very top routes prospects to /login or /#booking.
 *
 * The visual chrome mirrors the real DashboardShell so the product visibly
 * looks the same to a prospect previewing it.
 */

type SampleNavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

const operationsNav: SampleNavItem[] = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Alerts", icon: Bell },
  { label: "Inventory", icon: Package },
  { label: "Scan processing", icon: ScanLine },
  { label: "Activity", icon: History },
];

const managementNav: SampleNavItem[] = [
  { label: "Locations", icon: MapPin },
  { label: "Settings", icon: Settings },
];

function SampleLockup() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex size-9 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-[var(--accent)]">
        <BrandMark size={20} />
        <div
          className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
          aria-hidden
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-semibold tracking-[var(--tracking-heading)] text-foreground">
          Tantava
        </span>
        <span className="kicker mt-1 text-[9.5px] text-muted-foreground">Sample</span>
      </div>
    </div>
  );
}

function SampleNavSection({
  title,
  items,
}: {
  title: string;
  items: SampleNavItem[];
}) {
  return (
    <div className="space-y-2">
      <p className="kicker px-3 pt-4 pb-2 text-[10px] text-muted-foreground first:pt-0">
        {title}
      </p>
      {items.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          type="button"
          onClick={() => toast.info("Sign up to use this section.")}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-sm font-medium",
            "transition-colors duration-[var(--duration-base)] ease-[var(--ease)]",
            active
              ? "bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-foreground"
              : "text-muted-foreground hover:bg-[var(--surface)] hover:text-foreground",
          )}
        >
          {active ? (
            <span
              className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[var(--accent)]"
              aria-hidden
            />
          ) : null}
          <Icon
            className={cn(
              "size-[18px] shrink-0 transition-colors",
              active ? "text-[var(--accent)]" : "text-muted-foreground/80",
            )}
            strokeWidth={1.6}
            aria-hidden
          />
          {label}
        </button>
      ))}
    </div>
  );
}

export default function SampleDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SampleBanner />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="relative hidden w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
          <div className="surface-grain opacity-[0.03]" aria-hidden />
          <div className="relative flex flex-1 flex-col px-6 pb-6 pt-6">
            <Link
              href="/"
              className="mb-6 px-2 outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <SampleLockup />
            </Link>

            <div className="mb-6 rounded-[18px] border border-sidebar-border bg-[var(--surface)] px-4 py-4">
              <p className="kicker text-[9px] text-muted-foreground">Property</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-display text-[15px] font-medium leading-snug text-foreground">
                  Sample hotel group
                </p>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Illustrative data</p>
            </div>

            <nav className="flex flex-1 flex-col gap-2" aria-label="Sample navigation">
              <SampleNavSection title="Operations" items={operationsNav} />
              <SampleNavSection title="Management" items={managementNav} />
            </nav>

            <div className="mt-auto pt-10">
              <Link
                href="/#booking"
                className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-3 text-sm font-semibold"
              >
                Request a demo
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {/* Topbar (read-only) */}
          <header className="sticky top-[52px] z-20 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md md:px-6">
            <button
              type="button"
              onClick={() => toast.info("Sign up to search across your operation.")}
              className={cn(
                "hidden h-10 min-w-0 max-w-md flex-1 items-center gap-2.5 rounded-[16px] border border-border bg-[var(--surface)] px-4 text-left",
                "text-sm text-muted-foreground transition-colors duration-150",
                "hover:bg-[var(--surface-2)]",
                "md:flex",
              )}
            >
              <Search className="size-4 shrink-0 opacity-60" aria-hidden />
              <span className="truncate">Search Tantava…</span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-3 py-1 text-[11px] font-medium text-muted-foreground xl:flex">
                <span className="relative flex size-1.5">
                  <span
                    className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--success)] opacity-40"
                    aria-hidden
                  />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[var(--success)]" />
                </span>
                Sample data
              </span>

              <Button asChild variant="ghost" size="icon-sm" aria-label="Sample alerts">
                <button
                  type="button"
                  onClick={() => toast.info("Sign up to manage alerts.")}
                >
                  <Bell className="size-[18px]" strokeWidth={1.6} />
                </button>
              </Button>

              <Button asChild variant="primary" size="sm" className="hidden sm:inline-flex">
                <Link href="/#booking">Request demo</Link>
              </Button>
            </div>
          </header>

          <main className="relative flex-1">
            <div className="surface-grain opacity-[0.02]" aria-hidden />
            <div className="relative z-[1] mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
