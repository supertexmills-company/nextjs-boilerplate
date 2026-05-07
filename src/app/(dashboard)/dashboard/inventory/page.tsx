"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LinenItem } from "@/entities/inventory/types";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { EmptyState } from "@/features/dashboard/components/EmptyState";
import { LinenStatusBadge } from "@/features/dashboard/components/enum-badges";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { PaginationBar } from "@/features/dashboard/components/PaginationBar";
import type { CreateInventoryBody, UpdateInventoryBody } from "@/features/inventory/api/inventoryApi";
import {
  useCreateInventoryItemMutation,
  useListInventoryQuery,
  useMarkInventoryMissingMutation,
  useUpdateInventoryItemMutation,
} from "@/features/inventory/api/inventoryApi";
import { useListLocationsQuery } from "@/features/locations/api/locationsApi";
import { useAppSelector } from "@/store/hooks";
import { LINEN_STATUS_VALUES } from "@/shared/constants/domain";
import { fieldClassName } from "@/shared/styles/form";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";
function itemId(row: LinenItem) {
  return String(row._id ?? row.id ?? "");
}

export default function InventoryPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [status, setStatus] = useState("");
  const [missingFilter, setMissingFilter] = useState<"" | "true" | "false">("");
  const [locationId, setLocationId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<LinenItem | null>(null);
  const [missingItem, setMissingItem] = useState<LinenItem | null>(null);
  const limit = 15;

  const { data: locData } = useListLocationsQuery({ limit: 100, isActive: true });
  const locations = locData?.items ?? [];

  const queryArgs = useMemo(() => {
    const q: Record<string, string | number | boolean> = { page, limit };
    if (search.trim()) q.search = search.trim();
    if (status) q.status = status;
    if (locationId) q.location = locationId;
    if (missingFilter === "true") q.isMissing = true;
    if (missingFilter === "false") q.isMissing = false;
    return q;
  }, [page, limit, search, status, locationId, missingFilter]);

  const { data, isLoading, isError, refetch } = useListInventoryQuery(queryArgs as never);
  const [createRow, createState] = useCreateInventoryItemMutation();
  const [updateRow, updateState] = useUpdateInventoryItemMutation();
  const [markMissing, markState] = useMarkInventoryMissingMutation();

  const forbidden =
    (createState.error !== undefined &&
      isFetchBaseQueryError(createState.error) &&
      createState.error.status === 403) ||
    (updateState.error !== undefined &&
      isFetchBaseQueryError(updateState.error) &&
      updateState.error.status === 403);

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Inventory"
        subtitle="Linen items tracked by RFID and item code."
        actions={
          isAdmin ? (
            <Button type="button" variant="luxury" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add item
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="grid gap-4 p-4 pt-6 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground lg:col-span-2">
            Search (code or RFID)
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setSearch(searchDraft);
              }}
            >
              <Input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} placeholder="e.g. SHEET-…" />
              <Button type="submit" variant="secondary">
                Apply
              </Button>
            </form>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Status
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className={fieldClassName()}
            >
              <option value="">Any</option>
              {LINEN_STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Location
            <select
              value={locationId}
              onChange={(e) => {
                setPage(1);
                setLocationId(e.target.value);
              }}
              className={fieldClassName()}
            >
              <option value="">Any</option>
              {locations.map((loc) => (
                <option key={`${loc.code}-${String(loc._id ?? loc.id ?? "")}`} value={String(loc._id ?? loc.id)}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground md:col-span-2">
            Missing flag
            <select
              value={missingFilter}
              onChange={(e) => {
                setPage(1);
                setMissingFilter(e.target.value as "" | "true" | "false");
              }}
              className={fieldClassName()}
            >
              <option value="">Any</option>
              <option value="true">Missing only</option>
              <option value="false">Not missing</option>
            </select>
          </label>
        </CardContent>
      </Card>

      {forbidden ? (
        <p className="text-sm text-destructive">Your role cannot modify inventory metadata.</p>
      ) : null}

      {!isLoading && !isError && data && data.items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No linen items match"
          description="Adjust filters or add new stock (admins)."
        />
      ) : (
        <DataTable
          columns={[
            {
              id: "code",
              header: "Item code",
              cell: (row) => (
                <Link href={`/dashboard/inventory/${itemId(row)}`} className="font-medium text-amber hover:underline">
                  {row.itemCode}
                </Link>
              ),
            },
            {
              id: "rfid",
              header: "RFID",
              className: "font-mono text-xs text-muted-foreground",
              cell: (row) => row.rfidTagId,
            },
            {
              id: "type",
              header: "Type",
              cell: (row) => <span className="capitalize">{row.type}</span>,
            },
            {
              id: "status",
              header: "Status",
              cell: (row) => <LinenStatusBadge status={row.status} />,
            },
            {
              id: "missing",
              header: "Missing",
              cell: (row) =>
                row.isMissing ? (
                  <Badge variant="outline" dot tone="critical">
                    Yes
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">No</span>
                ),
            },
            {
              id: "wash",
              header: "Washes",
              className: "text-right font-mono tabular-nums",
              cell: (row) => row.washCount,
            },
            {
              id: "actions",
              header: "",
              className: "w-40 text-right",
              cell: (row) => (
                <div className="flex flex-wrap justify-end gap-1">
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/inventory/${itemId(row)}`}>View</Link>
                  </Button>
                  {isAdmin ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditItem(row)}>
                      Edit
                    </Button>
                  ) : null}
                  {!row.isMissing ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setMissingItem(row)}>
                      Mark missing
                    </Button>
                  ) : null}
                </div>
              ),
            },
          ]}
          rows={data?.items ?? []}
          getRowId={(row) => itemId(row)}
          isLoading={isLoading}
          error={isError ? "Could not load inventory." : undefined}
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

      {createOpen ? (
        <InventoryFormModal
          title="Add linen item"
          submitLabel="Create"
          loading={createState.isLoading}
          error={createState.error}
          locations={locations}
          initial={null}
          onClose={() => setCreateOpen(false)}
          onSubmit={async (body) => {
            await createRow(body as CreateInventoryBody).unwrap();
            setCreateOpen(false);
            void refetch();
          }}
        />
      ) : null}

      {editItem ? (
        <InventoryFormModal
          title="Edit linen item"
          submitLabel="Save"
          loading={updateState.isLoading}
          error={updateState.error}
          locations={locations}
          initial={editItem}
          onClose={() => setEditItem(null)}
          onSubmit={async (body) => {
            const id = itemId(editItem);
            await updateRow({ id, body: body as UpdateInventoryBody }).unwrap();
            setEditItem(null);
            void refetch();
          }}
        />
      ) : null}

      {missingItem ? (
        <MarkMissingModal
          item={missingItem}
          loading={markState.isLoading}
          error={markState.error}
          onClose={() => setMissingItem(null)}
          onSubmit={async (reason) => {
            await markMissing({ id: itemId(missingItem), reason }).unwrap();
            setMissingItem(null);
            void refetch();
          }}
        />
      ) : null}
    </div>
  );
}

type Loc = { _id?: string; id?: string; name: string; code: string };

function InventoryFormModal({
  title,
  submitLabel,
  loading,
  error,
  locations,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  loading: boolean;
  error: unknown;
  locations: Loc[];
  initial: LinenItem | null;
  onClose: () => void;
  onSubmit: (body: CreateInventoryBody | UpdateInventoryBody) => Promise<void>;
}) {
  const [itemCode, setItemCode] = useState(initial?.itemCode ?? "");
  const [rfidTagId, setRfidTagId] = useState(initial?.rfidTagId ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [location, setLocation] = useState(() => String(initial?.location ?? ""));

  const isEdit = !!initial;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <Card className="relative z-[1] max-h-[90vh] w-full max-w-lg overflow-y-auto shadow-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex flex-col gap-1 text-xs font-medium">
            Item code {!isEdit ? <span className="text-destructive">*</span> : null}
            <Input value={itemCode} onChange={(e) => setItemCode(e.target.value)} required />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            RFID <span className="text-destructive">*</span>
            <Input value={rfidTagId} onChange={(e) => setRfidTagId(e.target.value)} required />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Type {!isEdit ? <span className="text-destructive">*</span> : null}
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. sheet" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Location (optional)
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={fieldClassName()}>
              <option value="">—</option>
              {locations.map((loc) => (
                <option key={loc.code} value={String(loc._id ?? loc.id)}>
                  {loc.name}
                </option>
              ))}
            </select>
          </label>

          {isFetchBaseQueryError(error) ? (
            <p className="text-sm text-destructive">
              {(error.data && typeof error.data === "object" && "message" in error.data
                ? String((error.data as { message?: unknown }).message)
                : null) ?? `Request failed (${String(error.status)})`}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            disabled={loading || !itemCode.trim() || !rfidTagId.trim() || !type.trim()}
            onClick={async () => {
              const lid = location || null;
              if (isEdit) {
                await onSubmit({
                  itemCode: itemCode.trim().toUpperCase(),
                  rfidTagId: rfidTagId.trim(),
                  type: type.trim().toLowerCase(),
                  ...(lid ? { location: lid } : { location: null }),
                });
              } else {
                await onSubmit({
                  itemCode: itemCode.trim().toUpperCase(),
                  rfidTagId: rfidTagId.trim(),
                  type: type.trim().toLowerCase(),
                  ...(lid ? { location: lid } : {}),
                });
              }
            }}
          >
            {submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function MarkMissingModal({
  item,
  loading,
  error,
  onClose,
  onSubmit,
}: {
  item: LinenItem;
  loading: boolean;
  error: unknown;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <Card className="relative z-[1] w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Mark missing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Flag <span className="font-mono text-foreground">{item.itemCode}</span> as missing. This creates a critical
            alert.
          </p>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Reason (optional)
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Not returned from floor" />
          </label>
          {isFetchBaseQueryError(error) ? (
            <p className="text-sm text-destructive">Could not update item ({String(error.status)})</p>
          ) : null}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={loading} onClick={() => onSubmit(reason)}>
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
