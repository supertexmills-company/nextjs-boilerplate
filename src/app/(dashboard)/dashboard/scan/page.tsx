"use client";

import { ScanLine } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useListLocationsQuery } from "@/features/locations/api/locationsApi";
import { useProcessScanMutation, type ProcessScanResult } from "@/features/scans/api/scansApi";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { LinenStatusBadge } from "@/features/dashboard/components/enum-badges";
import { SCAN_EVENT_TYPE_VALUES } from "@/shared/constants/domain";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

const KEEP_LOCATION = "__keep__";

function errorMessage(err: unknown, fallback: string) {
  if (isFetchBaseQueryError(err)) {
    if (err.data && typeof err.data === "object" && "message" in err.data) {
      const m = (err.data as { message?: unknown }).message;
      if (typeof m === "string") return m;
    }
    return `${fallback} (${String(err.status)})`;
  }
  return fallback;
}

export default function ScanPage() {
  const { data: locData } = useListLocationsQuery({ limit: 200, isActive: true });
  const locations = locData?.items ?? [];
  const [processScan, state] = useProcessScanMutation();

  const [eventType, setEventType] = useState<string>(SCAN_EVENT_TYPE_VALUES[0]!);
  const [rfidTagId, setRfidTagId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [location, setLocation] = useState(KEEP_LOCATION);
  const [metadataJson, setMetadataJson] = useState("{}");
  const [result, setResult] = useState<ProcessScanResult | null>(null);

  const canSubmit = !!(rfidTagId.trim() || itemCode.trim());

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Operations"
        title="Scan processing"
        subtitle="Record an RFID or item code event. At least one identifier is required."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ScanLine className="size-5 text-[var(--brass)]" />
              Process event
            </CardTitle>
            <CardDescription>Payload matches POST /api/scans/process validation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Event type" htmlFor="scan-type">
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="scan-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCAN_EVENT_TYPE_VALUES.map((t) => (
                    <SelectItem key={t} value={t}>
                      <span className="capitalize">{t.replace(/-/g, " ")}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="RFID tag ID" htmlFor="scan-rfid">
              <Input
                id="scan-rfid"
                value={rfidTagId}
                onChange={(e) => setRfidTagId(e.target.value)}
                placeholder="Optional if code set"
              />
            </Field>
            <Field label="Item code" htmlFor="scan-code">
              <Input
                id="scan-code"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="Optional if RFID set"
              />
            </Field>
            <Field label="Location override" optional htmlFor="scan-loc">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="scan-loc">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={KEEP_LOCATION}>Keep / infer from item</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc.code} value={String(loc._id ?? loc.id)}>
                      {loc.name} ({loc.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field
              label="Metadata"
              optional
              htmlFor="scan-metadata"
              helper="JSON object — defaults to {}"
            >
              <Textarea
                id="scan-metadata"
                value={metadataJson}
                onChange={(e) => setMetadataJson(e.target.value)}
                rows={4}
                className="font-mono text-xs"
              />
            </Field>

            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto"
              disabled={!canSubmit || state.isLoading}
              onClick={async () => {
                let metadata: Record<string, unknown> = {};
                try {
                  const parsed: unknown = JSON.parse(metadataJson || "{}");
                  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                    metadata = parsed as Record<string, unknown>;
                  }
                } catch {
                  metadata = {};
                }
                try {
                  const res = await processScan({
                    eventType: eventType as (typeof SCAN_EVENT_TYPE_VALUES)[number],
                    rfidTagId: rfidTagId.trim() || undefined,
                    itemCode: itemCode.trim().toUpperCase() || undefined,
                    location: location === KEEP_LOCATION ? null : location || null,
                    metadata,
                  }).unwrap();
                  setResult(res);
                  toast.success(
                    res.linenItem
                      ? `Scan recorded · ${res.linenItem.itemCode}`
                      : "Scan recorded",
                  );
                } catch (err) {
                  toast.error(errorMessage(err, "Scan failed"));
                }
              }}
            >
              {state.isLoading ? "Processing…" : "Submit scan"}
            </Button>
          </CardContent>
        </Card>

        <Card accent>
          <CardHeader>
            <CardTitle className="text-lg">Result</CardTitle>
            <CardDescription>Updated linen item and persisted scan event reference.</CardDescription>
          </CardHeader>
          <CardContent>
            {result?.linenItem ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <LinenStatusBadge status={result.linenItem.status} />
                  {result.linenItem.isMissing ? (
                    <span className="text-xs text-[var(--danger)]">Previously missing — cleared on scan</span>
                  ) : null}
                </div>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="kicker">Item</dt>
                    <dd className="font-mono text-foreground">{result.linenItem.itemCode}</dd>
                  </div>
                  <div>
                    <dt className="kicker">RFID</dt>
                    <dd className="font-mono text-foreground">{result.linenItem.rfidTagId}</dd>
                  </div>
                  <div>
                    <dt className="kicker">Wash count</dt>
                    <dd className="font-mono tabular-nums text-foreground">{result.linenItem.washCount}</dd>
                  </div>
                  <div>
                    <dt className="kicker">Scan id</dt>
                    <dd className="break-all font-mono text-xs text-muted-foreground">
                      {typeof result.scanEvent === "object" && result.scanEvent && "_id" in result.scanEvent
                        ? String((result.scanEvent as { _id?: string })._id)
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Submit a scan to see the lifecycle response.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
