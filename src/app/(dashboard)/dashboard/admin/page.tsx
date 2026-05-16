"use client";

import Link from "next/link";
import { AlertTriangle, Layers, Radio, ScanLine, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { MetricTile } from "@/features/dashboard/components/MetricTile";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { Skeleton } from "@/features/dashboard/components/Skeleton";
import { useListUsersQuery } from "@/features/admin/api/adminApi";
import { useGetSummaryQuery } from "@/features/dashboard/api/dashboardApi";
import { useAppSelector } from "@/store/hooks";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

export default function AdminUsersPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const { data, isLoading, isError, error } = useListUsersQuery(undefined, {
    skip: role !== "admin",
  });
  const summary = useGetSummaryQuery({ windowHours: 24 }, { skip: role !== "admin" });

  if (role !== "admin") {
    return (
      <Card accent className="luxury-enter mx-auto max-w-xl">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--brass)_12%,transparent)] text-[var(--brass)]">
            <ShieldAlert className="size-5" />
          </div>
          <p className="kicker">Access</p>
          <CardTitle>Admin area</CardTitle>
          <CardDescription>
            Admin routes require an account with the{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">admin</code> role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">Back to overview</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Administration"
        title="Control room"
        subtitle="Operational snapshot and user directory."
      />

      {summary.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : summary.data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Total items" value={summary.data.totalItems.toLocaleString()} icon={<Layers />} />
          <MetricTile
            label="Missing"
            value={summary.data.missingItems.toLocaleString()}
            variant={summary.data.missingItems > 0 ? "alert" : "default"}
            icon={<AlertTriangle />}
          />
          <MetricTile
            label="Active alerts"
            value={summary.data.activeAlerts.toLocaleString()}
            variant={summary.data.activeAlerts > 0 ? "alert" : "default"}
            icon={<Radio />}
          />
          <MetricTile label="Scans (24h)" value={summary.data.scansInWindow.toLocaleString()} icon={<ScanLine />} />
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="kicker">Directory</p>
        <h2 className="font-display text-2xl font-medium tracking-[var(--tracking-heading)] text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground">Accounts authorized for Tantava Operations.</p>
      </div>

      <DataTable
        columns={[
          {
            id: "name",
            header: "Name",
            cell: (u) => <span className="font-medium text-foreground">{u.name}</span>,
          },
          {
            id: "email",
            header: "Email",
            cell: (u) => <span className="text-muted-foreground">{u.email}</span>,
          },
          {
            id: "role",
            header: "Role",
            cell: (u) => (
              <Badge variant="outline" intent={u.role === "admin" ? "brand" : "neutral"} dot>
                <span className="capitalize">{u.role}</span>
              </Badge>
            ),
          },
          {
            id: "actions",
            header: "",
            className: "w-24 text-right text-muted-foreground",
            cell: () => <span className="text-xs">—</span>,
          },
        ]}
        rows={data ?? []}
        getRowId={(u) => u.id}
        isLoading={isLoading}
        error={
          isError
            ? error !== undefined && isFetchBaseQueryError(error) && error.status === 403
              ? "Forbidden — admin role required for this listing."
              : error && "status" in error
                ? `Error (${String((error as { status: unknown }).status)})`
                : "Failed to load users."
            : undefined
        }
        emptyMessage="No users returned."
      />
    </div>
  );
}
