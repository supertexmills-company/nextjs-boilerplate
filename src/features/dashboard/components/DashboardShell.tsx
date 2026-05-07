"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  ScanLine,
  Search,
  Settings,
  Shield,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AppLogo from "@/marketing/components/ui/AppLogo";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useGetMeQuery } from "@/features/users/api/usersApi";
import { useAppSelector } from "@/store/hooks";
import type { User } from "@/entities/user/types";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const operationsNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/scan", label: "Scan processing", icon: ScanLine },
  { href: "/dashboard/history", label: "Activity", icon: History },
];

const managementNav: NavItem[] = [
  { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNav: NavItem[] = [{ href: "/dashboard/admin", label: "Administration", icon: Shield, adminOnly: true }];

function initials(user: User | null | undefined) {
  if (!user?.email) return "?";
  const raw = user.name?.trim() ?? "";
  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0]!.length >= 2) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

function navItemActive(pathname: string, href: string) {
  const path = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  if (href === "/dashboard") {
    return path === "/dashboard";
  }
  return path === href || path.startsWith(`${href}/`);
}

function filterNav(items: NavItem[], role: User["role"] | undefined) {
  return items.filter((item) => !item.adminOnly || role === "admin");
}

function navLinkClass(active: boolean) {
  return cn(
    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--amber)]"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  );
}

function NavSidebarSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-1">
      <p className="kicker px-3 pt-4 pb-1 text-[10px] text-muted-foreground first:pt-0">{title}</p>
      {items.map(({ href, label, icon: Icon }) => {
        const active = navItemActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={navLinkClass(active)}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function NavSections({
  pathname,
  role,
  onNavigate,
}: {
  pathname: string;
  role: User["role"] | undefined;
  onNavigate?: () => void;
}) {
  return (
    <>
      <NavSidebarSection title="Operations" items={filterNav(operationsNav, role)} pathname={pathname} onNavigate={onNavigate} />
      <NavSidebarSection title="Management" items={filterNav(managementNav, role)} pathname={pathname} onNavigate={onNavigate} />
      <NavSidebarSection title="Administration" items={filterNav(adminNav, role)} pathname={pathname} onNavigate={onNavigate} />
    </>
  );
}

export function DashboardShell({ children }: Readonly<{ children: React.ReactNode }>) {
  useGetMeQuery();
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const logout = useLogout();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const role = user?.role;

  return (
    <div className="theme-app flex min-h-screen bg-background text-foreground">
      <aside className="relative hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex lg:w-72">
        <div className="surface-grain opacity-[0.04]" aria-hidden />
        <div className="relative flex flex-1 flex-col px-4 pb-6 pt-8">
          <Link href="/dashboard" className="mb-6 px-2">
            <AppLogo
              size={36}
              src=""
              iconName="SignalIcon"
              text="LineTrack"
              className="text-sidebar-primary [&_span]:text-[17px] [&_span]:font-semibold"
            />
          </Link>

          <div className="mb-8 border-b border-sidebar-border/80 px-3 pb-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Property</p>
            <p className="font-display text-lg font-light leading-snug text-foreground">Operations center</p>
            <p className="mt-1 text-xs text-muted-foreground">Linen &amp; RFID tracking</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
            <NavSections pathname={pathname} role={role} />
          </nav>

          <div className="mt-auto space-y-4 pt-10">
            <div className="luxury-card border-sidebar-border bg-card/90 p-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground"
                  aria-hidden
                >
                  {initials(user)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{user?.name ?? "Loading…"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
                  {user?.role ? (
                    <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {user.role}
                    </span>
                  ) : null}
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => logout()} aria-label="Log out">
                  <LogOut className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md md:h-16 md:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="relative hidden max-w-md flex-1 md:flex">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              placeholder="Search operations…"
              readOnly
              className="h-9 w-full rounded-full border border-input bg-muted/40 pl-10 pr-4 text-sm text-muted-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              aria-label="Search (coming soon)"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground xl:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/75 opacity-40" aria-hidden />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            <Button asChild variant="luxury" size="sm" className="hidden sm:flex">
              <Link href="/dashboard/scan">
                <ScanLine className="size-4" />
                Process scan
              </Link>
            </Button>
            <Button asChild variant="luxury" size="icon-sm" className="sm:hidden" aria-label="Process scan">
              <Link href="/dashboard/scan">
                <ScanLine className="size-4" />
              </Link>
            </Button>
            <span className="hidden max-w-[10rem] truncate text-xs text-muted-foreground lg:hidden xl:inline-block xl:max-w-[14rem]">
              {user?.email}
            </span>
          </div>
        </header>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[min(100%,20rem)] flex-col overflow-y-auto border-r border-border bg-sidebar shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <AppLogo
                  size={32}
                  src=""
                  iconName="SignalIcon"
                  text="LineTrack"
                  className="text-sidebar-primary [&_span]:text-base [&_span]:font-semibold"
                />
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Close menu" onClick={() => setMobileNavOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
              <div className="border-b border-sidebar-border/80 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Property</p>
                <p className="font-display text-base font-light text-foreground">Operations center</p>
              </div>
              <nav className="flex flex-col gap-1 p-3 pb-8" aria-label="Mobile navigation">
                <NavSections pathname={pathname} role={role} onNavigate={() => setMobileNavOpen(false)} />
              </nav>
            </div>
          </div>
        ) : null}

        <main className="relative flex-1">
          <div className="surface-grain opacity-[0.025]" aria-hidden />
          <div className="relative z-[1] mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
