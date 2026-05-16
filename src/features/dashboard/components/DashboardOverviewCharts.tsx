"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/features/dashboard/components/DataTable";
import type { DashboardSummary } from "@/entities/dashboard/types";
import { cn } from "@/lib/utils";

const CHART_HEIGHT = 300;

/** Refined data viz palette — harmonized with brass/sage/slate-blue brand */
const STATUS_PALETTE: Record<string, string> = {
  active: "var(--success)",
  "replace-soon": "var(--accent-soft)",
  retired: "var(--muted)",
  missing: "var(--danger)",
};

const LOCATION_PALETTE = ["var(--accent)", "var(--accent-soft)", "var(--muted)", "var(--success)", "var(--text-soft)"];

function formatStatusLabel(id: string): string {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(id: string): string {
  const key = id.toLowerCase();
  return STATUS_PALETTE[key] ?? "var(--muted)";
}

function AnalyticsTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: unknown;
  payload?: ReadonlyArray<{ value?: unknown; payload?: Record<string, unknown> }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const data = row?.payload ?? {};
  const title =
    typeof data.fullLabel === "string"
      ? data.fullLabel
      : typeof data.label === "string"
        ? data.label
        : typeof data.name === "string"
          ? data.name
          : label != null && label !== ""
            ? String(label)
            : "—";
  const rawVal = row?.value;
  const val =
    rawVal === undefined || rawVal === null
      ? "—"
      : Array.isArray(rawVal)
        ? rawVal.join(", ")
        : typeof rawVal === "object"
          ? JSON.stringify(rawVal)
          : String(rawVal);
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-[var(--e2)]">
      <p className="font-medium text-popover-foreground">{title}</p>
      <p className="mt-1 tabular-nums">
        <span className="text-muted-foreground">Total </span>
        <span className="font-mono font-medium text-foreground">{val}</span>
      </p>
    </div>
  );
}

export function DashboardOverviewCharts({ data }: { data: DashboardSummary }) {
  const statusRows = useMemo(
    () =>
      data.statusBreakdown.map((row) => {
        const label = formatStatusLabel(row._id);
        return {
          key: row._id,
          label,
          fullLabel: label,
          count: row.count,
          fill: statusColor(row._id),
        };
      }),
    [data.statusBreakdown],
  );

  const locationRows = useMemo(
    () =>
      data.topLocations.map((row, i) => ({
        key: row.locationId ?? row.locationCode ?? `idx-${i}`,
        label: (row.locationName ?? row.locationCode ?? row.locationId ?? "Unassigned").slice(0, 42),
        fullLabel: row.locationName ?? row.locationCode ?? row.locationId ?? "Unassigned",
        count: row.count,
        fill: LOCATION_PALETTE[i % LOCATION_PALETTE.length]!,
      })),
    [data.topLocations],
  );

  const hasStatus = statusRows.length > 0;
  const hasLocations = locationRows.length > 0;

  return (
    <div className="space-y-8">
      <section
        className={cn(
          "rounded-[24px] border border-border bg-card p-6 md:p-10",
          "shadow-[var(--e1)]",
        )}
        aria-label="Distribution analytics"
      >
        <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="kicker">Distribution</p>
            <h2 className="font-display text-[40px] font-medium tracking-[var(--tracking-display)] text-foreground">
              Where stock lives
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Inventory by lifecycle status and where stock concentrates. Same source as the KPI row above.
            </p>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[var(--tracking-widest2)] text-muted-foreground">
            Window · {data.windowHours}h
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-border bg-[var(--surface)]">
            <CardHeader>
              <CardTitle className="text-base font-medium">Status mix</CardTitle>
              <CardDescription>
                Active, replace-soon, retired, missing — counts across all tracked items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasStatus ? (
                <>
                  <div style={{ height: CHART_HEIGHT }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statusRows}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          stroke="color-mix(in srgb, var(--muted-foreground) 12%, transparent)"
                          strokeDasharray="3 4"
                          vertical={false}
                        />
                        <XAxis
                          type="category"
                          dataKey="label"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: "color-mix(in srgb, var(--muted-foreground) 18%, transparent)" }}
                        />
                        <YAxis
                          type="number"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          cursor={{ fill: "color-mix(in srgb, var(--brass) 4%, transparent)" }}
                          content={(p) => (
                            <AnalyticsTooltip active={p.active} label={p.label} payload={p.payload as never} />
                          )}
                        />
                        <Bar dataKey="count" name="Items" radius={[8, 8, 0, 0]} maxBarSize={56}>
                          {statusRows.map((entry) => (
                            <Cell key={entry.key} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="mb-2 kicker text-[10px]">Table view</p>
                    <DataTable
                      density="compact"
                      columns={[
                        {
                          id: "status",
                          header: "Status",
                          cell: (row) => <span className="capitalize">{row._id.replace(/-/g, " ")}</span>,
                        },
                        {
                          id: "count",
                          header: "Count",
                          className: "text-right font-mono tabular-nums",
                          cell: (row) => row.count,
                        },
                      ]}
                      rows={data.statusBreakdown}
                      getRowId={(row) => row._id}
                    />
                  </div>
                </>
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No status breakdown available yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-[var(--surface)]">
            <CardHeader>
              <CardTitle className="text-base font-medium">Top locations</CardTitle>
              <CardDescription>
                Where counted items cluster in this snapshot — top five by volume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasLocations ? (
                <>
                  <div style={{ height: CHART_HEIGHT }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={locationRows}
                        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                        barCategoryGap="18%"
                      >
                        <CartesianGrid
                          stroke="color-mix(in srgb, var(--muted-foreground) 12%, transparent)"
                          strokeDasharray="3 4"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: "color-mix(in srgb, var(--muted-foreground) 18%, transparent)" }}
                          allowDecimals={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="label"
                          width={132}
                          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "color-mix(in srgb, var(--brass) 4%, transparent)" }}
                          content={(p) => (
                            <AnalyticsTooltip active={p.active} label={p.label} payload={p.payload as never} />
                          )}
                        />
                        <Bar dataKey="count" name="Items" radius={[0, 8, 8, 0]} maxBarSize={24}>
                          {locationRows.map((entry) => (
                            <Cell key={entry.key} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="mb-2 kicker text-[10px]">Table view</p>
                    <DataTable
                      density="compact"
                      columns={[
                        {
                          id: "loc",
                          header: "Location",
                          cell: (row) => row.locationName ?? row.locationCode ?? row.locationId ?? "—",
                        },
                        {
                          id: "count",
                          header: "Items",
                          className: "text-right font-mono tabular-nums",
                          cell: (row) => row.count,
                        },
                      ]}
                      rows={data.topLocations}
                      getRowId={(row, index) => row.locationId ?? row.locationCode ?? `row-${index}`}
                      emptyMessage="No rows."
                    />
                  </div>
                </>
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No location data in this window — scans and assignments will fill this chart.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
