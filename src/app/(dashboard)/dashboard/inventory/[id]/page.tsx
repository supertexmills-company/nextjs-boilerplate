"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetInventoryItemQuery,
  useMarkInventoryMissingMutation,
  useUpdateInventoryItemMutation,
} from "@/features/inventory/api/inventoryApi";
import { useListLocationsQuery } from "@/features/locations/api/locationsApi";
import { LinenStatusBadge } from "@/features/dashboard/components/enum-badges";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { Skeleton } from "@/features/dashboard/components/Skeleton";
import { useAppSelector } from "@/store/hooks";
import { LINEN_STATUS_VALUES } from "@/shared/constants/domain";
import { fieldClassName } from "@/shared/styles/form";
import { formatTimeAgo } from "@/lib/format-relative";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

export default function InventoryDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";

  const { data: item, isLoading, isError, refetch } = useGetInventoryItemQuery(id, { skip: !id });
  const { data: locData } = useListLocationsQuery({ limit: 100, isActive: true });
  const locations = locData?.items ?? [];
  const [markMissing, markState] = useMarkInventoryMissingMutation();
  const [updateItem, updateState] = useUpdateInventoryItemMutation();
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [washCount, setWashCount] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [location, setLocation] = useState("");

  if (!id) {
    return <p className="text-sm text-muted-foreground">Invalid item.</p>;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <Card className="border-destructive/40 p-8">
        <p className="kicker text-destructive">Not found</p>
        <p className="mt-2 text-sm text-muted-foreground">This linen item may have been removed.</p>
        <Button asChild variant="link" className="mt-4 px-0">
          <Link href="/dashboard/inventory">Back to inventory</Link>
        </Button>
      </Card>
    );
  }

  const openEdit = () => {
    setWashCount(item.washCount);
    setStatus(item.status);
    setLocation(item.location ? String(item.location) : "");
    setEditOpen(true);
  };

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Inventory"
        title={<span className="font-mono tracking-tight">{item.itemCode}</span>}
        subtitle="Item detail and lifecycle context."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/inventory">
                <ArrowLeft className="size-4" />
                All items
              </Link>
            </Button>
            {isAdmin ? (
              <Button type="button" variant="secondary" size="sm" onClick={openEdit}>
                Edit
              </Button>
            ) : null}
            {!item.isMissing ? (
              <Button type="button" variant="destructive" size="sm" onClick={() => setReasonOpen(true)}>
                Mark missing
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-3">
              <LinenStatusBadge status={item.status} />
              {item.isMissing ? (
                <Badge variant="outline" dot tone="critical">
                  Missing
                </Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              RFID <span className="font-mono text-foreground">{item.rfidTagId}</span> · Type{" "}
              <span className="capitalize">{item.type}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wash cycles</p>
              <p className="font-mono text-2xl tabular-nums text-foreground">{item.washCount}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last scan</p>
              <p className="text-sm text-foreground">
                {item.lastScannedAt ? formatTimeAgo(item.lastScannedAt, { addSuffix: true }) : "—"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recommended action</p>
              <p className="capitalize text-foreground">{item.recommendedAction?.replace(/-/g, " ") ?? "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-amber" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {item.location ? (
              <p className="text-sm text-muted-foreground">
                Linked location id: <code className="font-mono text-xs text-foreground">{String(item.location)}</code>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No location assigned.</p>
            )}
            <Button asChild variant="link" className="mt-2 h-auto px-0 text-amber">
              <Link href="/dashboard/locations">Manage locations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {reasonOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Dismiss"
            onClick={() => setReasonOpen(false)}
          />
          <Card className="relative z-[1] w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle>Mark missing</CardTitle>
              <CardDescription>Creates a critical alert and updates stock signals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" />
              {markState.error !== undefined && isFetchBaseQueryError(markState.error) ? (
                <p className="text-sm text-destructive">Update failed.</p>
              ) : null}
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setReasonOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={markState.isLoading}
                onClick={async () => {
                  await markMissing({ id, reason }).unwrap();
                  setReasonOpen(false);
                  void refetch();
                }}
              >
                Confirm
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}

      {editOpen && isAdmin ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Dismiss"
            onClick={() => setEditOpen(false)}
          />
          <Card className="relative z-[1] w-full max-w-lg shadow-2xl">
            <CardHeader>
              <CardTitle>Edit item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex flex-col gap-1 text-xs font-medium">
                Wash count
                <Input
                  type="number"
                  min={0}
                  value={washCount}
                  onChange={(e) => setWashCount(Number(e.target.value))}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium">
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClassName()}>
                  {LINEN_STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium">
                Location
                <select value={location} onChange={(e) => setLocation(e.target.value)} className={fieldClassName()}>
                  <option value="">— None</option>
                  {locations.map((loc) => (
                    <option key={loc.code} value={String(loc._id ?? loc.id)}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </label>
              {updateState.error !== undefined && isFetchBaseQueryError(updateState.error) ? (
                <p className="text-sm text-destructive">
                  {(updateState.error.data &&
                  typeof updateState.error.data === "object" &&
                  "message" in updateState.error.data
                    ? String((updateState.error.data as { message?: unknown }).message)
                    : null) ?? "Update failed."}
                </p>
              ) : null}
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={updateState.isLoading}
                onClick={async () => {
                  await updateItem({
                    id,
                    body: {
                      washCount,
                      status: status as (typeof LINEN_STATUS_VALUES)[number],
                      ...(location ? { location } : { location: null }),
                    },
                  }).unwrap();
                  setEditOpen(false);
                }}
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
