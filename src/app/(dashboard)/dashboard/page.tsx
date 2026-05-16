"use client";

import { useState } from "react";
import { AlertTriangle, Layers, Radio, ScanLine } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardOverviewCharts } from "@/features/dashboard/components/DashboardOverviewCharts";
import { MetricTile } from "@/features/dashboard/components/MetricTile";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { Skeleton } from "@/features/dashboard/components/Skeleton";
import { useGetSummaryQuery } from "@/features/dashboard/api/dashboardApi";

const WINDOW_OPTIONS = [
  { value: "24", label: "Last 24 hours" },
  { value: "48", label: "Last 48 hours" },
  { value: "168", label: "Last 7 days" },
];

export default function DashboardOverviewPage() {
  const [windowHours, setWindowHours] = useState("24");
  const { data, isLoading, isError, error } = useGetSummaryQuery({ windowHours: Number(windowHours) });

  if (isLoading) {
    return (
      <div className="space-y-10 luxury-enter">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[28rem] rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/35 p-8">
        <p className="kicker text-destructive">Unable to load</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error && "data" in error && typeof error.data === "object" && error.data
            ? JSON.stringify(error.data)
            : "Could not load dashboard. Sign in and ensure the API is running."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-10 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Overview"
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              A live read of your textile operation — items, missing stock, alerts, and scan throughput, refreshed from
              one summary endpoint.
            </span>
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">Window</span>
            <Select value={windowHours} onValueChange={setWindowHours}>
              <SelectTrigger size="sm" className="min-w-[10rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WINDOW_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <p className="-mt-4 max-w-3xl text-xs text-muted-foreground md:-mt-6">
        KPIs use inventory-wide totals where noted; scans follow the selected window ({data.windowHours}h). Charts mirror
        the same summary payload — refresh by navigating or reloading.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Total items"
          value={data.totalItems.toLocaleString()}
          icon={<Layers />}
          hint="Across all locations"
        />
        <MetricTile
          label="Missing"
          value={data.missingItems.toLocaleString()}
          variant={data.missingItems > 0 ? "alert" : "default"}
          icon={<AlertTriangle />}
          hint={data.missingItems > 0 ? "Requires investigation" : "All accounted for"}
        />
        <MetricTile
          label="Active alerts"
          value={data.activeAlerts.toLocaleString()}
          variant={data.activeAlerts > 0 ? "alert" : "default"}
          icon={<Radio />}
          hint={data.activeAlerts > 0 ? "Unresolved" : "All clear"}
        />
        <MetricTile
          label="Scans in window"
          value={data.scansInWindow.toLocaleString()}
          icon={<ScanLine />}
          hint={`${data.windowHours}h activity`}
        />
      </div>

      <DashboardOverviewCharts data={data} />
    </div>
  );
}
