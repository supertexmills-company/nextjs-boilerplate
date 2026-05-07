"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { EmptyState } from "@/features/dashboard/components/EmptyState";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { PaginationBar } from "@/features/dashboard/components/PaginationBar";
import type { ScanEventRecord } from "@/entities/scans/types";
import { useListScansQuery } from "@/features/scans/api/scansApi";
import { useAppSelector } from "@/store/hooks";
import { SCAN_EVENT_TYPE_VALUES } from "@/shared/constants/domain";
import { fieldClassName } from "@/shared/styles/form";
import { formatTimeAgo } from "@/lib/format-relative";

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
  const [eventType, setEventType] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const limit = 20;

  const queryArgs = useMemo(() => {
    const q: Record<string, string | number | boolean> = { page, limit };
    if (eventType) q.eventType = eventType;
    if (isAdmin && viewAll) q.all = true;
    return q;
  }, [page, limit, eventType, isAdmin, viewAll]);

  const { data, isLoading, isError } = useListScansQuery(queryArgs as never);

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Activity"
        subtitle={
          isAdmin && viewAll
            ? "All scan events (admin audit view)."
            : "Scan events you performed on this account."
        }
        actions={
          isAdmin ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={viewAll ? "default" : "outline"}
                onClick={() => {
                  setPage(1);
                  setViewAll((v) => !v);
                }}
              >
                {viewAll ? "My scans only" : "View all scans"}
              </Button>
            </div>
          ) : null
        }
      />

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base">Filters</CardTitle>
            <CardDescription>Narrow by scan event type.</CardDescription>
          </div>
          <label className="flex min-w-[12rem] flex-col gap-1 text-xs font-medium text-muted-foreground">
            Event type
            <select
              value={eventType}
              onChange={(e) => {
                setPage(1);
                setEventType(e.target.value);
              }}
              className={fieldClassName()}
            >
              <option value="">Any</option>
              {SCAN_EVENT_TYPE_VALUES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </CardHeader>
      </Card>

      {!isLoading && !isError && data && data.items.length === 0 ? (
        <EmptyState
          icon={History}
          title="No scan history yet"
          description="Process a scan from the Scan page to populate this log."
          className="max-w-xl"
        >
          <Button asChild variant="luxury" size="sm">
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
                    <Link href={`/dashboard/inventory/${id}`} className="font-mono text-amber hover:underline">
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
