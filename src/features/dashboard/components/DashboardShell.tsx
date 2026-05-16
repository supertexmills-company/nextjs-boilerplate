"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChevronDown,
  History,
  Keyboard,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MoreHorizontal,
  Package,
  ScanLine,
  Search,
  Settings,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command-palette";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useGetMeQuery } from "@/features/users/api/usersApi";
import { useListAlertsQuery } from "@/features/alerts/api/alertsApi";
import { useAppSelector } from "@/store/hooks";
import type { User as UserType } from "@/entities/user/types";
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

const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Administration", icon: Shield, adminOnly: true },
];

const mobileTabs: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/scan", label: "Scan", icon: ScanLine },
];

function initials(user: UserType | null | undefined) {
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
  if (href === "/dashboard") return path === "/dashboard";
  return path === href || path.startsWith(`${href}/`);
}

function filterNav(items: NavItem[], role: UserType["role"] | undefined) {
  return items.filter((item) => !item.adminOnly || role === "admin");
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
    <div className="space-y-2">
      <p className="kicker px-3 pt-4 pb-2 text-[10px] text-muted-foreground first:pt-0">{title}</p>
      {items.map(({ href, label, icon: Icon }) => {
        const active = navItemActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-medium",
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
  role: UserType["role"] | undefined;
  onNavigate?: () => void;
}) {
  return (
    <>
      <NavSidebarSection
        title="Operations"
        items={filterNav(operationsNav, role)}
        pathname={pathname}
        onNavigate={onNavigate}
      />
      <NavSidebarSection
        title="Management"
        items={filterNav(managementNav, role)}
        pathname={pathname}
        onNavigate={onNavigate}
      />
      <NavSidebarSection
        title="Administration"
        items={filterNav(adminNav, role)}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    </>
  );
}

function TantavaLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex size-9 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] text-[var(--accent)]">
        <Sparkles className="size-4" strokeWidth={1.8} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
          aria-hidden
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-semibold tracking-[var(--tracking-heading)] text-foreground">
          Tantava
        </span>
        {!compact ? (
          <span className="kicker mt-1 text-[9.5px] text-muted-foreground">Operations</span>
        ) : null}
      </div>
    </div>
  );
}

export function DashboardShell({ children }: Readonly<{ children: React.ReactNode }>) {
  useGetMeQuery();
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const role = user?.role;

  // Live unresolved alerts count for the notification bell
  const { data: openAlertsData } = useListAlertsQuery({ isResolved: false, limit: 1 });
  const unresolvedCount = openAlertsData?.pagination?.total ?? 0;

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (path: string) => {
    setPaletteOpen(false);
    router.push(path);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="relative hidden w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="surface-grain opacity-[0.03]" aria-hidden />
        <div className="relative flex flex-1 flex-col px-6 pb-6 pt-6">
          <Link href="/dashboard" className="mb-6 px-2 outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
            <TantavaLockup />
          </Link>

          <div className="mb-6 rounded-[18px] border border-sidebar-border bg-[var(--surface)] px-4 py-4">
            <p className="kicker text-[9px] text-muted-foreground">Property</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="font-display text-[15px] font-medium leading-snug text-foreground">
                Operations center
              </p>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Single site</p>
          </div>

          <nav className="flex flex-1 flex-col gap-2" aria-label="Main navigation">
            <NavSections pathname={pathname} role={role} />
          </nav>

          <div className="mt-auto pt-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-[18px] border border-sidebar-border",
                    "bg-[var(--surface)] px-3 py-3 text-left",
                    "transition-colors duration-[var(--duration-base)] hover:bg-[var(--surface-2)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  )}
                >
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[12px] font-semibold text-[var(--accent)]"
                    aria-hidden
                  >
                    {initials(user)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {user?.name ?? "Loading…"}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{user?.email ?? "—"}</p>
                  </div>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-56">
                <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                <div className="px-2.5 pb-1.5 text-xs text-muted-foreground">
                  <p className="truncate font-medium text-foreground">{user?.name ?? "—"}</p>
                  <p className="truncate">{user?.email ?? "—"}</p>
                  {user?.role ? (
                    <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                      {user.role}
                    </span>
                  ) : null}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setPaletteOpen(true)}>
                  <Keyboard /> Command palette
                  <span className="ml-auto text-[10px] tracking-widest text-muted-foreground">⌘K</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={() => logout()}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md md:px-6">
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

          {/* Cmd+K trigger styled like a search bar */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className={cn(
              "hidden h-10 min-w-0 max-w-md flex-1 items-center gap-2.5 rounded-[16px] border border-border bg-[var(--surface)] px-4 text-left",
              "text-sm text-muted-foreground transition-colors duration-150",
              "hover:bg-[var(--surface-2)] hover:border-[color-mix(in_srgb,var(--border)_60%,var(--accent)_40%)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              "md:flex",
            )}
          >
            <Search className="size-4 shrink-0 opacity-60" aria-hidden />
            <span className="truncate">Search Tantava…</span>
            <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] tracking-wider lg:inline-block">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-3 py-1 text-[11px] font-medium text-muted-foreground xl:flex">
              <span className="relative flex size-1.5">
                <span
                  className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--success)] opacity-40"
                  aria-hidden
                />
                <span className="relative inline-flex size-1.5 rounded-full bg-[var(--success)]" />
              </span>
              Live
            </span>

            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label={`Alerts${unresolvedCount > 0 ? ` (${unresolvedCount} unresolved)` : ""}`}
            >
              <Link href="/dashboard/alerts">
                <Bell className="size-[18px]" strokeWidth={1.6} />
                {unresolvedCount > 0 ? (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[9px] font-semibold leading-none text-[var(--surface)]">
                    {unresolvedCount > 99 ? "99+" : unresolvedCount}
                  </span>
                ) : null}
              </Link>
            </Button>

            <Button asChild variant="primary" size="sm" className="hidden sm:inline-flex">
              <Link href="/dashboard/scan">
                <ScanLine className="size-4" />
                Process scan
              </Link>
            </Button>
            <Button asChild variant="primary" size="icon-sm" className="sm:hidden" aria-label="Process scan">
              <Link href="/dashboard/scan">
                <ScanLine className="size-4" />
              </Link>
            </Button>

            {/* Compact avatar dropdown for desktop only when sidebar is hidden — but desktop has sidebar, so this is hidden md+. Mobile uses dropdown in topbar. */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)] md:hidden",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  )}
                  aria-label="Account menu"
                >
                  {initials(user)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <div className="px-2.5 pb-1.5 text-xs">
                  <p className="truncate font-medium text-foreground">{user?.name ?? "—"}</p>
                  <p className="truncate text-muted-foreground">{user?.email ?? "—"}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <User /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem destructive onSelect={() => logout()}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-[rgba(30,26,23,0.34)] backdrop-blur-sm"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[min(100%,20rem)] flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar shadow-[var(--e3)] animate-[dialog-content-in_220ms_var(--ease)]">
              <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
                <TantavaLockup compact />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-2 p-3 pb-24" aria-label="Mobile navigation">
                <NavSections
                  pathname={pathname}
                  role={role}
                  onNavigate={() => setMobileNavOpen(false)}
                />
              </nav>
            </div>
          </div>
        ) : null}

        <main id="main-content" className="relative flex-1 pb-20 md:pb-0">
          <div className="surface-grain opacity-[0.02]" aria-hidden />
          <div className="relative z-[1] mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav
          aria-label="Mobile primary navigation"
          className={cn(
            "fixed bottom-0 left-0 right-0 z-30 md:hidden",
            "border-t border-border bg-background/95 backdrop-blur-lg",
            "pb-[max(env(safe-area-inset-bottom),4px)]",
          )}
        >
          <div className="grid grid-cols-5 px-1 pt-1">
            {mobileTabs.map(({ href, label, icon: Icon }) => {
              const active = navItemActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium",
                    "transition-colors",
                    active ? "text-[var(--accent)]" : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
                  <span>{label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
              aria-label="Open more"
            >
              <MoreHorizontal className="size-[18px]" strokeWidth={1.6} aria-hidden />
              <span>More</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Command palette */}
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen} placeholder="Search Tantava — pages, actions…">
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard /> Overview
            <CommandShortcut>G O</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/alerts")}>
            <Bell /> Alerts
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/inventory")}>
            <Package /> Inventory
            <CommandShortcut>G I</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/scan")}>
            <ScanLine /> Scan processing
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/history")}>
            <History /> Activity
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/locations")}>
            <MapPin /> Locations
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/settings")}>
            <Settings /> Settings
          </CommandItem>
          {role === "admin" ? (
            <CommandItem onSelect={() => go("/dashboard/admin")}>
              <Shield /> Administration
            </CommandItem>
          ) : null}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go("/dashboard/scan")}>
            <ScanLine /> Process new scan event
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/inventory")}>
            <Search /> Search inventory by code or RFID
          </CommandItem>
          <CommandItem onSelect={() => logout()}>
            <LogOut /> Sign out
          </CommandItem>
        </CommandGroup>
      </CommandDialog>
    </div>
  );
}
