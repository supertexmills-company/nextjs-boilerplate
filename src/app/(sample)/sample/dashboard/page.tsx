"use client";

import { AlertTriangle, Layers, Radio, ScanLine } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardOverviewCharts } from "@/features/dashboard/components/DashboardOverviewCharts";
import { MetricTile } from "@/features/dashboard/components/MetricTile";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { sampleDashboardSummary } from "@/marketing/content/sample-data";

/**
 * /sample/dashboard — public, no-auth preview of the Overview page.
 *
 * Renders the real MetricTile, PageHeader, and DashboardOverviewCharts
 * components against a seeded `DashboardSummary` (no RTK Query, no API).
 * Intended as the destination for the marketing-page "See a sample dashboard"
 * CTA.
 */
export default function SampleDashboardPage() {
  const data = sampleDashboardSummary;

  return (
    <div className="space-y-10 luxury-enter">
      <PageHeader
        kicker="Sample · Operations"
        title="Overview"
        subtitle="A live read of your textile operation — items, missing stock, alerts, and scan throughput. The numbers below are illustrative."
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">Window</span>
            <Select value="24">
              <SelectTrigger size="sm" className="min-w-[10rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">Last 24 hours</SelectItem>
                <SelectItem value="48">Last 48 hours</SelectItem>
                <SelectItem value="168">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <p className="-mt-4 max-w-3xl text-xs text-muted-foreground md:-mt-6">
        Sample data shown for illustration. Sign in to see your real operation.
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
