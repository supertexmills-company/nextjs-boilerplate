"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatTimeAgo } from "@/lib/format-relative";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

function errorMessage(err: unknown, fallback: string) {
  if (isFetchBaseQueryError(err)) {
    if (err.data && typeof err.data === "object" && "message" in err.data) {
      return String((err.data as { message?: unknown }).message ?? fallback);
    }
    return `${fallback} (${String(err.status)})`;
  }
  return fallback;
}

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
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  setReason("");
                  setReasonOpen(true);
                }}
              >
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
                <Badge variant="outline" intent="danger" dot>
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
              <p className="kicker">Wash cycles</p>
              <p className="font-mono text-2xl tabular-nums text-foreground">{item.washCount}</p>
            </div>
            <div>
              <p className="kicker">Last scan</p>
              <p className="text-sm text-foreground">
                {item.lastScannedAt ? formatTimeAgo(item.lastScannedAt, { addSuffix: true }) : "—"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="kicker">Recommended action</p>
              <p className="capitalize text-foreground">{item.recommendedAction?.replace(/-/g, " ") ?? "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-[var(--brass)]" />
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
            <Button asChild variant="link" className="mt-2 h-auto px-0">
              <Link href="/dashboard/locations">Manage locations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={reasonOpen} onOpenChange={setReasonOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Mark missing</DialogTitle>
            <DialogDescription>Creates a critical alert and updates stock signals.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Field label="Reason" optional htmlFor="missing-reason-detail">
              <Input
                id="missing-reason-detail"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Not returned from floor"
                autoFocus
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setReasonOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={markState.isLoading}
              onClick={async () => {
                try {
                  await markMissing({ id, reason }).unwrap();
                  toast.success("Item marked missing");
                  setReasonOpen(false);
                  void refetch();
                } catch (err) {
                  toast.error(errorMessage(err, "Could not update item"));
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen && isAdmin} onOpenChange={(o) => (!o ? setEditOpen(false) : null)}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Edit item</DialogTitle>
            <DialogDescription>Adjust lifecycle metadata. Use with care — these values feed alerts.</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <Field label="Wash count" htmlFor="edit-wash">
              <Input
                id="edit-wash"
                type="number"
                min={0}
                value={washCount}
                onChange={(e) => setWashCount(Number(e.target.value))}
              />
            </Field>
            <Field label="Status" htmlFor="edit-status">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LINEN_STATUS_VALUES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="capitalize">{s.replace(/-/g, " ")}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Location" optional htmlFor="edit-loc">
              <Select
                value={location || "__none__"}
                onValueChange={(v) => setLocation(v === "__none__" ? "" : v)}
              >
                <SelectTrigger id="edit-loc">
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
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={updateState.isLoading}
              onClick={async () => {
                try {
                  await updateItem({
                    id,
                    body: {
                      washCount,
                      status: status as (typeof LINEN_STATUS_VALUES)[number],
                      ...(location ? { location } : { location: null }),
                    },
                  }).unwrap();
                  toast.success("Item updated");
                  setEditOpen(false);
                } catch (err) {
                  toast.error(errorMessage(err, "Could not update item"));
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
