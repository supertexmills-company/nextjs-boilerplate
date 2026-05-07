import type { ReactNode } from "react";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";

/** Authenticated app shell — dark Altitude theme + session via RTK Query (`/users/me`). */
export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
