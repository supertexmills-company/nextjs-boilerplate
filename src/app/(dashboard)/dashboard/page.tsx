"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Layers, Radio, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardOverviewCharts } from "@/features/dashboard/components/DashboardOverviewCharts";
import { MetricTile } from "@/features/dashboard/components/MetricTile";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { Skeleton } from "@/features/dashboard/components/Skeleton";
import { useGetSummaryQuery } from "@/features/dashboard/api/dashboardApi";
import { fieldClassName } from "@/shared/styles/form";

const WINDOW_OPTIONS = [
  { value: 24, label: "Last 24 hours" },
  { value: 48, label: "Last 48 hours" },
  { value: 168, label: "Last 7 days" },
];

export default function DashboardOverviewPage() {
  const [windowHours, setWindowHours] = useState(24);
  const { data, isLoading, isError, error } = useGetSummaryQuery({ windowHours });

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
      <Card className="luxury-card border-destructive/35 p-8">
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
        title={
          <>
            Overview, <span className="text-muted-foreground italic">at a glance</span>
          </>
        }
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Clean analytics from your live summary — easy to scan with charts and compact tables.</span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/75 opacity-40 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Live telemetry
            </span>
          </span>
        }
        actions={
          <>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Window</span>
              <select
                value={windowHours}
                onChange={(e) => setWindowHours(Number(e.target.value))}
                className={fieldClassName("h-9 min-w-[10rem] py-1.5")}
              >
                {WINDOW_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <Button asChild variant="luxury" size="sm">
              <Link href="/dashboard/scan">
                <ScanLine className="size-4" />
                Process scan
              </Link>
            </Button>
          </>
        }
      />

      <p className="-mt-4 max-w-3xl text-xs text-muted-foreground md:-mt-6">
        KPIs use inventory-wide totals where noted; scans follow the selected window ({data.windowHours}h). Charts mirror
        the same API payload — no separate “AI” series; refresh by navigating or reloading data.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile label="Total items" value={data.totalItems} icon={<Layers />} />
        <MetricTile
          label="Missing"
          value={data.missingItems}
          variant={data.missingItems > 0 ? "alert" : "default"}
          icon={<AlertTriangle />}
        />
        <MetricTile
          label="Active alerts"
          value={data.activeAlerts}
          variant={data.activeAlerts > 0 ? "alert" : "default"}
          icon={<Radio />}
        />
        <MetricTile label="Scans in window" value={data.scansInWindow} icon={<ScanLine />} />
      </div>

      <DashboardOverviewCharts data={data} />
    </div>
  );
}
