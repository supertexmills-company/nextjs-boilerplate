"use client";

import { MapPin, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { fieldClassName } from "@/shared/styles/form";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

function locId(row: LocationRecord) {
  return String(row._id ?? row.id ?? "");
}

export default function LocationsPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [category, setCategory] = useState("");
  const [activeOnly, setActiveOnly] = useState<"" | "true" | "false">("true");
  const [createOpen, setCreateOpen] = useState(false);
  const [editLoc, setEditLoc] = useState<LocationRecord | null>(null);
  const limit = 20;

  const queryArgs = useMemo(() => {
    const q: Record<string, string | number | boolean> = { page, limit };
    if (search.trim()) q.search = search.trim();
    if (category) q.category = category;
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
            <Button type="button" variant="luxury" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add location
            </Button>
          ) : null
        }
      />

      {!isAdmin ? (
        <p className="text-xs text-muted-foreground">
          Editing locations requires an <Badge variant="outline" dot tone="admin">admin</Badge> role.
        </p>
      ) : null}

      <Card>
        <CardContent className="grid gap-4 p-4 pt-6 md:grid-cols-2 lg:grid-cols-4">
          <form
            className="contents"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearch(searchDraft);
            }}
          >
            <label className="flex flex-col gap-1 md:col-span-2 lg:col-span-2">
              <span className="text-xs font-medium text-muted-foreground">Search name / code</span>
              <div className="flex gap-2">
                <Input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} />
                <Button type="submit" variant="secondary">
                  Apply
                </Button>
              </div>
            </label>
          </form>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClassName()}>
              <option value="">Any</option>
              {LOCATION_CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Activity
            <select
              value={activeOnly}
              onChange={(e) => setActiveOnly(e.target.value as typeof activeOnly)}
              className={fieldClassName()}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
              <option value="">All</option>
            </select>
          </label>
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
                  <Badge variant="secondary" dot tone="success">
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="outline" tone="critical">
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
                        className="text-destructive"
                        disabled={deactivateState.isLoading}
                        onClick={async () => {
                          if (!confirm(`Deactivate ${row.name}?`)) return;
                          await deactivateLoc(locId(row)).unwrap();
                          void refetch();
                        }}
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

      {createOpen ? (
        <LocationFormModal
          title="Add location"
          submitLabel="Create"
          loading={createState.isLoading}
          error={createState.error}
          initial={null}
          onClose={() => setCreateOpen(false)}
          onSubmit={async (body) => {
            await createLoc(body as CreateLocationBody).unwrap();
            setCreateOpen(false);
            void refetch();
          }}
        />
      ) : null}

      {editLoc ? (
        <LocationFormModal
          title="Edit location"
          submitLabel="Save"
          loading={updateState.isLoading}
          error={updateState.error}
          initial={editLoc}
          onClose={() => setEditLoc(null)}
          onSubmit={async (body) => {
            await updateLoc({ id: locId(editLoc), body: body as UpdateLocationBody }).unwrap();
            setEditLoc(null);
            void refetch();
          }}
        />
      ) : null}
    </div>
  );
}

function LocationFormModal({
  title,
  submitLabel,
  loading,
  error,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  loading: boolean;
  error: unknown;
  initial: LocationRecord | null;
  onClose: () => void;
  onSubmit: (body: CreateLocationBody | UpdateLocationBody) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "other");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

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
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex flex-col gap-1 text-xs font-medium">
            Name
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Code
            <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={!!initial} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClassName()}>
              {LOCATION_CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          {initial ? (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
            </label>
          ) : null}
          {isFetchBaseQueryError(error) ? <p className="text-sm text-destructive">Request failed.</p> : null}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading || !name.trim() || !code.trim()}
            onClick={async () => {
              if (initial) {
                await onSubmit({
                  name: name.trim(),
                  code: code.trim(),
                  category,
                  isActive,
                });
              } else {
                await onSubmit({
                  name: name.trim(),
                  code: code.trim(),
                  category,
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
