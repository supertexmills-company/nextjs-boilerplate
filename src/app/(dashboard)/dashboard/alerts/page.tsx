"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
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

const ANY = "__any__";
type ResolvedFilter = "open" | "resolved" | "all";

function alertId(row: AlertRecord) {
  return String(row._id ?? row.id ?? "");
}

export default function AlertsPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const [page, setPage] = useState(1);
  const [filterResolved, setFilterResolved] = useState<ResolvedFilter>("open");
  const [typeFilter, setTypeFilter] = useState<string>(ANY);
  const [severityFilter, setSeverityFilter] = useState<string>(ANY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const limit = 15;

  const queryArgs = useMemo(() => {
    const base: Record<string, string | number | boolean> = { page, limit };
    if (typeFilter && typeFilter !== ANY) base.type = typeFilter;
    if (severityFilter && severityFilter !== ANY) base.severity = severityFilter;
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
        toast.success("Alert resolved");
        setSelectedId(null);
        void refetch();
      } catch (e) {
        const message =
          isFetchBaseQueryError(e) && e.status === 403
            ? "Admin permission required to resolve alerts."
            : "Could not resolve alert. Please retry.";
        toast.error(message);
      }
    },
    [resolveAlert, refetch],
  );

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Alerts"
        subtitle="System and lifecycle signals. Admins can resolve items when action is complete."
      />

      <Card>
        <CardContent className="flex flex-col gap-5 md:flex-row md:items-end md:gap-6">
          <Field label="Status">
            <SegmentedControl
              aria-label="Resolved status"
              value={filterResolved}
              onChange={(v) => {
                setPage(1);
                setFilterResolved(v);
              }}
              options={[
                { value: "open", label: "Open" },
                { value: "resolved", label: "Resolved" },
                { value: "all", label: "All" },
              ]}
            />
          </Field>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Type" htmlFor="filter-type">
              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setPage(1);
                  setTypeFilter(v);
                }}
              >
                <SelectTrigger id="filter-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any type</SelectItem>
                  {ALERT_TYPE_VALUES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Severity" htmlFor="filter-severity">
              <Select
                value={severityFilter}
                onValueChange={(v) => {
                  setPage(1);
                  setSeverityFilter(v);
                }}
              >
                <SelectTrigger id="filter-severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any severity</SelectItem>
                  {ALERT_SEVERITY_VALUES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

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
                  <Badge variant="outline" intent="success" dot>
                    Resolved
                  </Badge>
                ) : (
                  <Badge variant="outline" intent="warning" dot>
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

      <Dialog open={Boolean(selected)} onOpenChange={(o) => (!o ? setSelectedId(null) : null)}>
        {selected ? (
          <DialogContent size="lg">
            <DialogHeader>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <AlertTypeBadge type={selected.type} />
                <AlertSeverityBadge severity={selected.severity} />
                {selected.isResolved ? (
                  <Badge variant="outline" intent="success" dot>
                    Resolved
                  </Badge>
                ) : (
                  <Badge variant="outline" intent="warning" dot>
                    Active
                  </Badge>
                )}
              </div>
              <DialogTitle>Alert detail</DialogTitle>
              <DialogDescription>{selected.message}</DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Signature:</span>{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{selected.signature}</code>
              </p>
              {selected.metadata && Object.keys(selected.metadata).length > 0 ? (
                <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs">
                  {JSON.stringify(selected.metadata, null, 2)}
                </pre>
              ) : null}
              <p className="text-xs">
                {selected.updatedAt
                  ? `Last updated ${formatTimeAgo(selected.updatedAt, { addSuffix: true })}`
                  : selected.createdAt
                    ? `Created ${formatTimeAgo(selected.createdAt, { addSuffix: true })}`
                    : null}
              </p>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setSelectedId(null)}>
                Close
              </Button>
              {isAdmin && !selected.isResolved ? (
                <Button
                  type="button"
                  variant="primary"
                  disabled={resolveState.isLoading}
                  onClick={() => onResolve(alertId(selected))}
                >
                  <CheckCircle className="size-4" />
                  Mark resolved
                </Button>
              ) : null}
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
