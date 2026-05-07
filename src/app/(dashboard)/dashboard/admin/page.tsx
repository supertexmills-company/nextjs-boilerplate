"use client";

import Link from "next/link";
import { AlertTriangle, Layers, Radio, ScanLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
      <Card className="luxury-card luxury-enter max-w-lg">
        <CardHeader>
          <p className="kicker">Access</p>
          <CardTitle className="font-display text-2xl font-light">Admin area</CardTitle>
          <CardDescription>
            Admin routes require an account with the <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">admin</code>{" "}
            role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-amber underline-offset-4 transition-colors hover:text-amber-light hover:underline"
          >
            Back to overview
          </Link>
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
          <MetricTile label="Total items" value={summary.data.totalItems} icon={<Layers />} />
          <MetricTile
            label="Missing"
            value={summary.data.missingItems}
            variant={summary.data.missingItems > 0 ? "alert" : "default"}
            icon={<AlertTriangle />}
          />
          <MetricTile
            label="Active alerts"
            value={summary.data.activeAlerts}
            variant={summary.data.activeAlerts > 0 ? "alert" : "default"}
            icon={<Radio />}
          />
          <MetricTile label="Scans (24h)" value={summary.data.scansInWindow} icon={<ScanLine />} />
        </div>
      ) : null}

      <div className="space-y-3">
        <h2 className="font-display text-lg font-light text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground">Directory of accounts authorized for LineTrack.</p>
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
              <Badge variant="outline" dot tone={u.role === "admin" ? "admin" : "user"}>
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
