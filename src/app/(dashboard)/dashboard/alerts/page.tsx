"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlertRecord } from "@/entities/alerts/types";
import { useListAlertsQuery, useResolveAlertMutation } from "@/features/alerts/api/alertsApi";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { AlertSeverityBadge, AlertTypeBadge } from "@/features/dashboard/components/enum-badges";
import { EmptyState } from "@/features/dashboard/components/EmptyState";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { PaginationBar } from "@/features/dashboard/components/PaginationBar";
import { useAppSelector } from "@/store/hooks";
import { ALERT_SEVERITY_VALUES, ALERT_TYPE_VALUES } from "@/shared/constants/domain";
import { formatTimeAgo } from "@/lib/format-relative";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";
import { fieldClassName } from "@/shared/styles/form";

function alertId(row: AlertRecord) {
  return String(row._id ?? row.id ?? "");
}

export default function AlertsPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const [page, setPage] = useState(1);
  const [filterResolved, setFilterResolved] = useState<"all" | "open" | "resolved">("open");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const limit = 15;

  const queryArgs = useMemo(() => {
    const base: Record<string, string | number | boolean> = { page, limit };
    if (typeFilter) base.type = typeFilter;
    if (severityFilter) base.severity = severityFilter;
    if (filterResolved === "open") base.isResolved = false;
    if (filterResolved === "resolved") base.isResolved = true;
    return base;
  }, [page, limit, typeFilter, severityFilter, filterResolved]);

  const { data, isLoading, isError, error, refetch } = useListAlertsQuery(queryArgs as never);
  const [resolveAlert, resolveState] = useResolveAlertMutation();

  const selected = data?.items.find((a) => alertId(a) === selectedId) ?? null;

  const onResolve = useCallback(
    async (id: string) => {
      try {
        await resolveAlert(id).unwrap();
        setSelectedId(null);
        void refetch();
      } catch {
        /* surfaced via resolveState */
      }
    },
    [resolveAlert, refetch],
  );

  const forbidden =
    resolveState.error !== undefined &&
    isFetchBaseQueryError(resolveState.error) &&
    resolveState.error.status === 403;

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Alerts"
        subtitle="System and lifecycle signals. Admins can resolve items when action is complete."
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 pt-6 md:flex-row md:flex-wrap md:items-end md:gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["open", "Open"],
                  ["resolved", "Resolved"],
                  ["all", "All"],
                ] as const
              ).map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={filterResolved === key ? "default" : "outline"}
                  className={filterResolved === key ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => {
                    setPage(1);
                    setFilterResolved(key);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-wrap gap-4">
            <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs font-medium text-muted-foreground">
              Type
              <select
                value={typeFilter}
                onChange={(e) => {
                  setPage(1);
                  setTypeFilter(e.target.value);
                }}
                className={fieldClassName()}
              >
                <option value="">Any</option>
                {ALERT_TYPE_VALUES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs font-medium text-muted-foreground">
              Severity
              <select
                value={severityFilter}
                onChange={(e) => {
                  setPage(1);
                  setSeverityFilter(e.target.value);
                }}
                className={fieldClassName()}
              >
                <option value="">Any</option>
                {ALERT_SEVERITY_VALUES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      {forbidden ? (
        <p className="text-sm text-destructive" role="alert">
          You do not have permission to resolve alerts (admin only).
        </p>
      ) : null}

      {!isLoading && !isError && data && data.items.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No alerts in this view"
          description="Try changing filters or resolution status. Healthy operations may show an empty inbox."
        />
      ) : (
        <DataTable
          columns={[
            {
              id: "severity",
              header: "Severity",
              cell: (row) => <AlertSeverityBadge severity={row.severity} />,
            },
            {
              id: "type",
              header: "Type",
              cell: (row) => <AlertTypeBadge type={row.type} />,
            },
            {
              id: "message",
              header: "Message",
              cell: (row) => <span className="line-clamp-2 text-muted-foreground">{row.message}</span>,
            },
            {
              id: "status",
              header: "Status",
              cell: (row) =>
                row.isResolved ? (
                  <Badge variant="secondary" dot tone="success">
                    Resolved
                  </Badge>
                ) : (
                  <Badge variant="outline" dot tone="warning">
                    Active
                  </Badge>
                ),
            },
            {
              id: "when",
              header: "Updated",
              className: "whitespace-nowrap text-xs text-muted-foreground",
              cell: (row) =>
                row.updatedAt
                  ? formatTimeAgo(row.updatedAt, { addSuffix: true })
                  : row.createdAt
                    ? formatTimeAgo(row.createdAt, { addSuffix: true })
                    : "—",
            },
            {
              id: "open",
              header: "",
              className: "w-24 text-right",
              cell: (row) => (
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedId(alertId(row))}>
                  Details
                </Button>
              ),
            },
          ]}
          rows={data?.items ?? []}
          getRowId={(row) => alertId(row)}
          isLoading={isLoading}
          error={
            isError && error !== undefined
              ? isFetchBaseQueryError(error) && error.status === 403
                ? "Access denied."
                : "Could not load alerts."
              : undefined
          }
          emptyMessage="No alerts."
        />
      )}

      {data?.pagination ? (
        <PaginationBar
          page={data.pagination.page}
          pages={data.pagination.pages}
          total={data.pagination.total}
          limit={data.pagination.limit}
          onPageChange={setPage}
        />
      ) : null}

      {selected ? (
        <Card className="border-amber/25">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="kicker">Alert detail</p>
                <CardTitle className="flex flex-wrap items-center gap-2">
                  <AlertTypeBadge type={selected.type} />
                  <AlertSeverityBadge severity={selected.severity} />
                </CardTitle>
                <CardDescription>{selected.message}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {isAdmin && !selected.isResolved ? (
                  <Button
                    type="button"
                    variant="default"
                    disabled={resolveState.isLoading}
                    onClick={() => onResolve(alertId(selected))}
                  >
                    <CheckCircle className="size-4" />
                    Mark resolved
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" onClick={() => setSelectedId(null)}>
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Signature:</span>{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{selected.signature}</code>
            </p>
            {selected.metadata && Object.keys(selected.metadata).length > 0 ? (
              <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs">
                {JSON.stringify(selected.metadata, null, 2)}
              </pre>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
