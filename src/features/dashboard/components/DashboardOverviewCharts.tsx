"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/features/dashboard/components/DataTable";
import type { DashboardSummary } from "@/entities/dashboard/types";
import { cn } from "@/lib/utils";

const CHART_HEIGHT = 300;

/** Distinct, accessible series colors (work on dark theme-app). */
const STATUS_PALETTE: Record<string, string> = {
  active: "#34d399",
  "replace-soon": "#fbbf24",
  retired: "#94a3b8",
  missing: "#f87171",
};

const LOCATION_PALETTE = ["#60a5fa", "#a78bfa", "#f472b6", "#2dd4bf", "#fbbf24"];

function formatStatusLabel(id: string): string {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(id: string): string {
  const key = id.toLowerCase();
  return STATUS_PALETTE[key] ?? "#94a3b8";
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
    <div className="rounded-lg border border-border/80 bg-popover px-3 py-2.5 text-xs shadow-lg backdrop-blur-md">
      <p className="font-semibold text-popover-foreground">{title}</p>
      <p className="mt-1 tabular-nums">
        <span className="text-muted-foreground">Total </span>
        <span className="font-mono text-foreground">{val}</span>
      </p>
    </div>
  );
}

export function DashboardOverviewCharts({ data }: { data: DashboardSummary }) {
  const statusRows = data.statusBreakdown.map((row) => {
    const label = formatStatusLabel(row._id);
    return {
      key: row._id,
      label,
      fullLabel: label,
      count: row.count,
      fill: statusColor(row._id),
    };
  });

  const locationRows = data.topLocations.map((row, i) => ({
    key: row.locationId ?? row.locationCode ?? `idx-${i}`,
    label: (row.locationName ?? row.locationCode ?? row.locationId ?? "Unassigned").slice(0, 42),
    fullLabel: row.locationName ?? row.locationCode ?? row.locationId ?? "Unassigned",
    count: row.count,
    fill: LOCATION_PALETTE[i % LOCATION_PALETTE.length]!,
  }));

  const hasStatus = statusRows.length > 0;
  const hasLocations = locationRows.length > 0;

  return (
    <div className="space-y-8">
      <section
        className={cn(
          "rounded-2xl border border-border/40 bg-gradient-to-b from-card/95 to-card/70 p-5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] md:p-7",
        )}
        aria-label="Distribution analytics"
      >
        <div className="mb-6 flex flex-col gap-1 border-b border-border/50 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-lg font-light tracking-tight text-foreground md:text-xl">Distribution</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Inventory by lifecycle status and where stock concentrates. Values come from your live summary — same
              source as the KPI row above.
            </p>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Window: {data.windowHours}h
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-border/50 bg-background/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-foreground">Status mix</CardTitle>
              <CardDescription>How many items are in each state (active, replace-soon, retired, missing).</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {hasStatus ? (
                <>
                  <div style={{ height: CHART_HEIGHT }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statusRows}
                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        barCategoryGap="18%"
                      >
                        <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="4 4" vertical={false} />
                        <XAxis
                          type="category"
                          dataKey="label"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
                        />
                        <YAxis
                          type="number"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                          content={(p) => (
                            <AnalyticsTooltip active={p.active} label={p.label} payload={p.payload as never} />
                          )}
                        />
                        <Bar dataKey="count" name="Items" radius={[6, 6, 0, 0]} maxBarSize={48}>
                          {statusRows.map((entry) => (
                            <Cell key={entry.key} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Tip: spikes in “Missing” or “Replace soon” usually deserve a follow-up on{" "}
                    <span className="text-amber/90">Alerts</span> or <span className="text-amber/90">Inventory</span>.
                  </p>
                </>
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">No status breakdown available yet.</p>
              )}
              {hasStatus ? (
                <div className="mt-6 border-t border-border/40 pt-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Table view</p>
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
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-foreground">Top locations</CardTitle>
              <CardDescription>Where counted items cluster in this snapshot (top five by volume).</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {hasLocations ? (
                <>
                  <div style={{ height: CHART_HEIGHT }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={locationRows}
                        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                        barCategoryGap="16%"
                      >
                        <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="4 4" horizontal={false} />
                        <XAxis
                          type="number"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
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
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                          content={(p) => (
                            <AnalyticsTooltip active={p.active} label={p.label} payload={p.payload as never} />
                          )}
                        />
                        <Bar dataKey="count" name="Items" radius={[0, 6, 6, 0]} maxBarSize={22}>
                          {locationRows.map((entry) => (
                            <Cell key={entry.key} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Bars read left → right as volume. Compare with{" "}
                    <span className="text-amber/90">Locations</span> to adjust sites or RFID coverage.
                  </p>
                </>
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No location data in this window — scans and assignments will fill this chart.
                </p>
              )}
              {hasLocations ? (
                <div className="mt-6 border-t border-border/40 pt-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Table view</p>
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
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-label="KPI comparison" className="rounded-2xl border border-border/40 bg-card/30 p-5 md:p-6">
        <h3 className="font-display text-base font-light text-foreground">Volume snapshot</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Same four headline numbers as the tiles, shown as bars so teams can compare scale at a glance.
        </p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Total items", value: data.totalItems, fill: "#60a5fa" },
                { name: "Missing", value: data.missingItems, fill: data.missingItems > 0 ? "#f87171" : "#64748b" },
                { name: "Active alerts", value: data.activeAlerts, fill: data.activeAlerts > 0 ? "#fbbf24" : "#64748b" },
                { name: `Scans (${data.windowHours}h)`, value: data.scansInWindow, fill: "#34d399" },
              ]}
              margin={{ top: 8, right: 8, left: 0, bottom: 32 }}
              barCategoryGap="22%"
            >
              <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(148,163,184,0.15)" }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={48}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                content={(p) => (
                  <AnalyticsTooltip active={p.active} label={p.label} payload={p.payload as never} />
                )}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {[
                  "#60a5fa",
                  data.missingItems > 0 ? "#f87171" : "#64748b",
                  data.activeAlerts > 0 ? "#fbbf24" : "#64748b",
                  "#34d399",
                ].map((fill, i) => (
                  <Cell key={i} fill={fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
