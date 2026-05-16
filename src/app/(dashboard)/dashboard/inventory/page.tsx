"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
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
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

const ANY = "__any__";

function itemId(row: LinenItem) {
  return String(row._id ?? row.id ?? "");
}

function errorMessage(err: unknown, fallback: string) {
  if (isFetchBaseQueryError(err)) {
    if (err.data && typeof err.data === "object" && "message" in err.data) {
      return String((err.data as { message?: unknown }).message ?? fallback);
    }
    return `${fallback} (${String(err.status)})`;
  }
  return fallback;
}

export default function InventoryPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [status, setStatus] = useState(ANY);
  const [missingFilter, setMissingFilter] = useState<"any" | "true" | "false">("any");
  const [locationId, setLocationId] = useState(ANY);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<LinenItem | null>(null);
  const [missingItem, setMissingItem] = useState<LinenItem | null>(null);
  const limit = 15;

  const { data: locData } = useListLocationsQuery({ limit: 100, isActive: true });
  const locations = locData?.items ?? [];

  const queryArgs = useMemo(() => {
    const q: Record<string, string | number | boolean> = { page, limit };
    if (search.trim()) q.search = search.trim();
    if (status && status !== ANY) q.status = status;
    if (locationId && locationId !== ANY) q.location = locationId;
    if (missingFilter === "true") q.isMissing = true;
    if (missingFilter === "false") q.isMissing = false;
    return q;
  }, [page, limit, search, status, locationId, missingFilter]);

  const { data, isLoading, isError, refetch } = useListInventoryQuery(queryArgs as never);
  const [createRow, createState] = useCreateInventoryItemMutation();
  const [updateRow, updateState] = useUpdateInventoryItemMutation();
  const [markMissing, markState] = useMarkInventoryMissingMutation();

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Inventory"
        subtitle="Linen items tracked by RFID and item code."
        actions={
          isAdmin ? (
            <Button type="button" variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add item
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Search (code or RFID)" className="lg:col-span-2">
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
          </Field>
          <Field label="Status" htmlFor="inv-status">
            <Select
              value={status}
              onValueChange={(v) => {
                setPage(1);
                setStatus(v);
              }}
            >
              <SelectTrigger id="inv-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any status</SelectItem>
                {LINEN_STATUS_VALUES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="capitalize">{s.replace(/-/g, " ")}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Location" htmlFor="inv-location">
            <Select
              value={locationId}
              onValueChange={(v) => {
                setPage(1);
                setLocationId(v);
              }}
            >
              <SelectTrigger id="inv-location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any location</SelectItem>
                {locations.map((loc) => (
                  <SelectItem
                    key={`${loc.code}-${String(loc._id ?? loc.id ?? "")}`}
                    value={String(loc._id ?? loc.id)}
                  >
                    {loc.name} ({loc.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Missing flag" htmlFor="inv-missing" className="md:col-span-2 lg:col-span-2">
            <Select
              value={missingFilter}
              onValueChange={(v) => {
                setPage(1);
                setMissingFilter(v as "any" | "true" | "false");
              }}
            >
              <SelectTrigger id="inv-missing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="true">Missing only</SelectItem>
                <SelectItem value="false">Not missing</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

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
                <Link
                  href={`/dashboard/inventory/${itemId(row)}`}
                  className="font-medium text-[var(--brass)] hover:underline"
                >
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
                  <Badge variant="outline" intent="danger" dot>
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

      <InventoryFormDialog
        open={createOpen}
        title="Add linen item"
        submitLabel="Create"
        loading={createState.isLoading}
        locations={locations}
        initial={null}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (body) => {
          try {
            await createRow(body as CreateInventoryBody).unwrap();
            toast.success("Linen item created");
            setCreateOpen(false);
            void refetch();
          } catch (err) {
            toast.error(errorMessage(err, "Could not create item"));
          }
        }}
      />

      <InventoryFormDialog
        open={Boolean(editItem)}
        title="Edit linen item"
        submitLabel="Save"
        loading={updateState.isLoading}
        locations={locations}
        initial={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={async (body) => {
          if (!editItem) return;
          try {
            const id = itemId(editItem);
            await updateRow({ id, body: body as UpdateInventoryBody }).unwrap();
            toast.success("Saved");
            setEditItem(null);
            void refetch();
          } catch (err) {
            toast.error(errorMessage(err, "Could not save changes"));
          }
        }}
      />

      <MarkMissingDialog
        item={missingItem}
        loading={markState.isLoading}
        onClose={() => setMissingItem(null)}
        onSubmit={async (reason) => {
          if (!missingItem) return;
          try {
            await markMissing({ id: itemId(missingItem), reason }).unwrap();
            toast.success(`${missingItem.itemCode} marked missing`);
            setMissingItem(null);
            void refetch();
          } catch (err) {
            toast.error(errorMessage(err, "Could not update item"));
          }
        }}
      />
    </div>
  );
}

type Loc = { _id?: string; id?: string; name: string; code: string };

function InventoryFormDialog({
  open,
  title,
  submitLabel,
  loading,
  locations,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  submitLabel: string;
  loading: boolean;
  locations: Loc[];
  initial: LinenItem | null;
  onClose: () => void;
  onSubmit: (body: CreateInventoryBody | UpdateInventoryBody) => Promise<void>;
}) {
  const [itemCode, setItemCode] = useState(initial?.itemCode ?? "");
  const [rfidTagId, setRfidTagId] = useState(initial?.rfidTagId ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [location, setLocation] = useState(() => String(initial?.location ?? ""));
  const isEdit = Boolean(initial);

  useEffect(() => {
    if (!open) return;
    setItemCode(initial?.itemCode ?? "");
    setRfidTagId(initial?.rfidTagId ?? "");
    setType(initial?.type ?? "");
    setLocation(String(initial?.location ?? ""));
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update item metadata. Wash count and status are managed by scans."
              : "Register a new RFID-tagged linen item."}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <Field label="Item code" required={!isEdit} htmlFor="inv-code">
            <Input
              id="inv-code"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              placeholder="e.g. SHEET-001"
              autoFocus
            />
          </Field>
          <Field label="RFID tag" required htmlFor="inv-rfid">
            <Input id="inv-rfid" value={rfidTagId} onChange={(e) => setRfidTagId(e.target.value)} />
          </Field>
          <Field label="Type" required={!isEdit} htmlFor="inv-type">
            <Input id="inv-type" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. sheet" />
          </Field>
          <Field label="Location" optional htmlFor="inv-form-loc">
            <Select value={location || "__none__"} onValueChange={(v) => setLocation(v === "__none__" ? "" : v)}>
              <SelectTrigger id="inv-form-loc">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— No location</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.code} value={String(loc._id ?? loc.id)}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MarkMissingDialog({
  item,
  loading,
  onClose,
  onSubmit,
}: {
  item: LinenItem | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (item) setReason("");
  }, [item]);

  return (
    <Dialog open={Boolean(item)} onOpenChange={(o) => (!o ? onClose() : null)}>
      {item ? (
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Mark missing</DialogTitle>
            <DialogDescription>
              Flag <span className="font-mono text-foreground">{item.itemCode}</span> as missing. This will create a
              critical alert.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Field label="Reason" optional htmlFor="missing-reason">
              <Input
                id="missing-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Not returned from floor"
                autoFocus
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={loading} onClick={() => onSubmit(reason)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

