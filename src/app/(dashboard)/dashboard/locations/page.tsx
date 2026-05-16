"use client";

import { MapPin, Plus } from "lucide-react";
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
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toast } from "@/components/ui/toast";
import type { LocationRecord } from "@/entities/locations/types";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { LocationCategoryBadge } from "@/features/dashboard/components/enum-badges";
import { EmptyState } from "@/features/dashboard/components/EmptyState";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { PaginationBar } from "@/features/dashboard/components/PaginationBar";
import type { CreateLocationBody, UpdateLocationBody } from "@/features/locations/api/locationsApi";
import {
  useCreateLocationMutation,
  useDeactivateLocationMutation,
  useListLocationsQuery,
  useUpdateLocationMutation,
} from "@/features/locations/api/locationsApi";
import { useAppSelector } from "@/store/hooks";
import { LOCATION_CATEGORY_VALUES } from "@/shared/constants/domain";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

const ANY = "__any__";

function locId(row: LocationRecord) {
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

export default function LocationsPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [category, setCategory] = useState(ANY);
  const [activeOnly, setActiveOnly] = useState<"true" | "false" | "all">("true");
  const [createOpen, setCreateOpen] = useState(false);
  const [editLoc, setEditLoc] = useState<LocationRecord | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<LocationRecord | null>(null);
  const limit = 20;

  const queryArgs = useMemo(() => {
    const q: Record<string, string | number | boolean> = { page, limit };
    if (search.trim()) q.search = search.trim();
    if (category && category !== ANY) q.category = category;
    if (activeOnly === "true") q.isActive = true;
    if (activeOnly === "false") q.isActive = false;
    return q;
  }, [page, limit, search, category, activeOnly]);

  const { data, isLoading, isError, refetch } = useListLocationsQuery(queryArgs as never);
  const [createLoc, createState] = useCreateLocationMutation();
  const [updateLoc, updateState] = useUpdateLocationMutation();
  const [deactivateLoc, deactivateState] = useDeactivateLocationMutation();

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Management"
        title="Locations"
        subtitle={
          isAdmin ? "Define property zones for scans and aggregation." : "Directory of active property locations."
        }
        actions={
          isAdmin ? (
            <Button type="button" variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add location
            </Button>
          ) : null
        }
      />

      {!isAdmin ? (
        <p className="text-xs text-muted-foreground">
          Editing locations requires an{" "}
          <Badge variant="outline" intent="brand" dot>
            admin
          </Badge>{" "}
          role.
        </p>
      ) : null}

      <Card>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Search name / code" className="md:col-span-2">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setSearch(searchDraft);
              }}
            >
              <Input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} />
              <Button type="submit" variant="secondary">
                Apply
              </Button>
            </form>
          </Field>
          <Field label="Category" htmlFor="loc-cat">
            <Select
              value={category}
              onValueChange={(v) => {
                setPage(1);
                setCategory(v);
              }}
            >
              <SelectTrigger id="loc-cat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any category</SelectItem>
                {LOCATION_CATEGORY_VALUES.map((c) => (
                  <SelectItem key={c} value={c}>
                    <span className="capitalize">{c.replace(/-/g, " ")}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Activity">
            <SegmentedControl
              aria-label="Active filter"
              value={activeOnly}
              onChange={(v) => setActiveOnly(v)}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
                { value: "all", label: "All" },
              ]}
            />
          </Field>
        </CardContent>
      </Card>

      {!isLoading && !isError && data && data.items.length === 0 ? (
        <EmptyState icon={MapPin} title="No locations" description="Admins can add laundry, floor, and storage nodes." />
      ) : (
        <DataTable
          columns={[
            {
              id: "name",
              header: "Name",
              cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
            },
            {
              id: "code",
              header: "Code",
              className: "font-mono text-sm",
              cell: (row) => row.code,
            },
            {
              id: "cat",
              header: "Category",
              cell: (row) => <LocationCategoryBadge category={row.category} />,
            },
            {
              id: "active",
              header: "Active",
              cell: (row) =>
                row.isActive ? (
                  <Badge variant="outline" intent="success" dot>
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="outline" intent="danger">
                    No
                  </Badge>
                ),
            },
            {
              id: "actions",
              header: "",
              className: "w-36 text-right",
              cell: (row) =>
                isAdmin ? (
                  <div className="flex justify-end gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditLoc(row)}>
                      Edit
                    </Button>
                    {row.isActive ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-[var(--danger)]"
                        disabled={deactivateState.isLoading}
                        onClick={() => setConfirmDeactivate(row)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Inactive</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
          ]}
          rows={data?.items ?? []}
          getRowId={(row) => locId(row)}
          isLoading={isLoading}
          error={isError ? "Could not load locations." : undefined}
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

      <LocationFormDialog
        open={createOpen}
        title="Add location"
        submitLabel="Create"
        loading={createState.isLoading}
        initial={null}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (body) => {
          try {
            await createLoc(body as CreateLocationBody).unwrap();
            toast.success("Location created");
            setCreateOpen(false);
            void refetch();
          } catch (err) {
            toast.error(errorMessage(err, "Could not create location"));
          }
        }}
      />

      <LocationFormDialog
        open={Boolean(editLoc)}
        title="Edit location"
        submitLabel="Save"
        loading={updateState.isLoading}
        initial={editLoc}
        onClose={() => setEditLoc(null)}
        onSubmit={async (body) => {
          if (!editLoc) return;
          try {
            await updateLoc({ id: locId(editLoc), body: body as UpdateLocationBody }).unwrap();
            toast.success("Location updated");
            setEditLoc(null);
            void refetch();
          } catch (err) {
            toast.error(errorMessage(err, "Could not save location"));
          }
        }}
      />

      <Dialog open={Boolean(confirmDeactivate)} onOpenChange={(o) => (!o ? setConfirmDeactivate(null) : null)}>
        {confirmDeactivate ? (
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Deactivate location?</DialogTitle>
              <DialogDescription>
                {confirmDeactivate.name} ({confirmDeactivate.code}) will no longer appear in active pickers. Existing
                scans remain.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setConfirmDeactivate(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deactivateState.isLoading}
                onClick={async () => {
                  try {
                    await deactivateLoc(locId(confirmDeactivate)).unwrap();
                    toast.success("Location deactivated");
                    setConfirmDeactivate(null);
                    void refetch();
                  } catch (err) {
                    toast.error(errorMessage(err, "Could not deactivate"));
                  }
                }}
              >
                Deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function LocationFormDialog({
  open,
  title,
  submitLabel,
  loading,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  submitLabel: string;
  loading: boolean;
  initial: LocationRecord | null;
  onClose: () => void;
  onSubmit: (body: CreateLocationBody | UpdateLocationBody) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "other");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setCode(initial?.code ?? "");
    setCategory(initial?.category ?? "other");
    setIsActive(initial?.isActive ?? true);
  }, [open, initial]);

  const isEdit = Boolean(initial);

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the location metadata." : "Create a property zone (laundry, floor, storage)."}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <Field label="Name" required htmlFor="loc-form-name">
            <Input id="loc-form-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Field
            label="Code"
            required
            htmlFor="loc-form-code"
            helper={isEdit ? "Code is immutable after creation." : undefined}
          >
            <Input id="loc-form-code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} />
          </Field>
          <Field label="Category" htmlFor="loc-form-cat">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="loc-form-cat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_CATEGORY_VALUES.map((c) => (
                  <SelectItem key={c} value={c}>
                    <span className="capitalize">{c.replace(/-/g, " ")}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {isEdit ? (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-border accent-[var(--brass)]"
              />
              Active
            </label>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={loading || !name.trim() || !code.trim()}
            onClick={async () => {
              if (isEdit) {
                await onSubmit({ name: name.trim(), code: code.trim(), category, isActive });
              } else {
                await onSubmit({ name: name.trim(), code: code.trim(), category });
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
