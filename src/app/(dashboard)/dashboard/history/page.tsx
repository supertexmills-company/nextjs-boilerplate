"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { EmptyState } from "@/features/dashboard/components/EmptyState";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { PaginationBar } from "@/features/dashboard/components/PaginationBar";
import type { ScanEventRecord } from "@/entities/scans/types";
import { useListScansQuery } from "@/features/scans/api/scansApi";
import { useAppSelector } from "@/store/hooks";
import { SCAN_EVENT_TYPE_VALUES } from "@/shared/constants/domain";
import { formatTimeAgo } from "@/lib/format-relative";

const ANY = "__any__";

function scanId(row: ScanEventRecord) {
  return String(row._id ?? row.id ?? "");
}

function locationLabel(loc: ScanEventRecord["location"]): string {
  if (!loc) return "—";
  if (typeof loc === "string") return loc.slice(0, 8);
  const l = loc as { name?: string; code?: string };
  return l.name ?? l.code ?? "—";
}

export default function HistoryPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const [page, setPage] = useState(1);
  const [eventType, setEventType] = useState(ANY);
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const limit = 20;

  const queryArgs = useMemo(() => {
    const q: Record<string, string | number | boolean> = { page, limit };
    if (eventType && eventType !== ANY) q.eventType = eventType;
    if (isAdmin && scope === "all") q.all = true;
    return q;
  }, [page, limit, eventType, isAdmin, scope]);

  const { data, isLoading, isError } = useListScansQuery(queryArgs as never);

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Activity"
        subtitle={
          isAdmin && scope === "all"
            ? "All scan events (admin audit view)."
            : "Scan events you performed on this account."
        }
        actions={
          isAdmin ? (
            <SegmentedControl
              aria-label="Scan scope"
              value={scope}
              onChange={(v) => {
                setPage(1);
                setScope(v);
              }}
              options={[
                { value: "mine", label: "My scans" },
                { value: "all", label: "All scans" },
              ]}
            />
          ) : null
        }
      />

      <Card>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Field label="Event type" htmlFor="hist-type">
            <Select
              value={eventType}
              onValueChange={(v) => {
                setPage(1);
                setEventType(v);
              }}
            >
              <SelectTrigger id="hist-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any event</SelectItem>
                {SCAN_EVENT_TYPE_VALUES.map((t) => (
                  <SelectItem key={t} value={t}>
                    <span className="capitalize">{t.replace(/-/g, " ")}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {!isLoading && !isError && data && data.items.length === 0 ? (
        <EmptyState
          icon={History}
          title="No scan history yet"
          description="Process a scan from the Scan page to populate this log."
          className="max-w-xl"
        >
          <Button asChild variant="primary" size="sm">
            <Link href="/dashboard/scan">Go to scan</Link>
          </Button>
        </EmptyState>
      ) : (
        <DataTable
          columns={[
            {
              id: "when",
              header: "When",
              className: "whitespace-nowrap text-xs text-muted-foreground",
              cell: (row) => formatTimeAgo(row.scannedAt ?? row.createdAt, { addSuffix: true }),
            },
            {
              id: "event",
              header: "Event",
              cell: (row) => <span className="font-medium capitalize">{row.eventType.replace(/-/g, " ")}</span>,
            },
            {
              id: "item",
              header: "Item",
              cell: (row) => {
                let id: string | undefined;
                let code = row.itemCode;
                if (row.linenItem && typeof row.linenItem === "object") {
                  const li = row.linenItem as { _id?: string; id?: string; itemCode?: string };
                  id = String(li._id ?? li.id);
                  code = li.itemCode ?? code;
                } else if (typeof row.linenItem === "string") {
                  id = row.linenItem;
                }
                if (id) {
                  return (
                    <Link href={`/dashboard/inventory/${id}`} className="font-mono text-[var(--brass)] hover:underline">
                      {code}
                    </Link>
                  );
                }
                return <span className="font-mono">{code}</span>;
              },
            },
            {
              id: "rfid",
              header: "RFID",
              className: "font-mono text-xs text-muted-foreground",
              cell: (row) => row.rfidTagId?.slice(0, 14) ?? "—",
            },
            {
              id: "loc",
              header: "Location",
              cell: (row) => <span className="text-muted-foreground">{locationLabel(row.location)}</span>,
            },
          ]}
          rows={data?.items ?? []}
          getRowId={(row) => scanId(row)}
          isLoading={isLoading}
          error={isError ? "Could not load history." : undefined}
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
    </div>
  );
}
