"use client";

import { ScanLine } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useListLocationsQuery } from "@/features/locations/api/locationsApi";
import { useProcessScanMutation, type ProcessScanResult } from "@/features/scans/api/scansApi";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { LinenStatusBadge } from "@/features/dashboard/components/enum-badges";
import { SCAN_EVENT_TYPE_VALUES } from "@/shared/constants/domain";
import { fieldClassName } from "@/shared/styles/form";
import { isFetchBaseQueryError } from "@/lib/rtk-errors";

export default function ScanPage() {
  const { data: locData } = useListLocationsQuery({ limit: 200, isActive: true });
  const locations = locData?.items ?? [];
  const [processScan, state] = useProcessScanMutation();

  const [eventType, setEventType] = useState<string>(SCAN_EVENT_TYPE_VALUES[0]!);
  const [rfidTagId, setRfidTagId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [location, setLocation] = useState("");
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
              <ScanLine className="size-5 text-amber" />
              Process event
            </CardTitle>
            <CardDescription>Payload matches POST /api/scans/process validation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Event type
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={fieldClassName()}>
                {SCAN_EVENT_TYPE_VALUES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              RFID tag ID
              <Input value={rfidTagId} onChange={(e) => setRfidTagId(e.target.value)} placeholder="Optional if code set" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Item code
              <Input value={itemCode} onChange={(e) => setItemCode(e.target.value)} placeholder="Optional if RFID set" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Location (optional override)
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={fieldClassName()}>
                <option value="">— Keep / infer from item</option>
                {locations.map((loc) => (
                  <option key={loc.code} value={String(loc._id ?? loc.id)}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Metadata (JSON object)
              <textarea
                value={metadataJson}
                onChange={(e) => setMetadataJson(e.target.value)}
                rows={4}
                className={fieldClassName("min-h-[6rem] resize-y py-2 font-mono text-xs")}
              />
            </label>

            {state.error !== undefined && isFetchBaseQueryError(state.error) ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(state.error.data &&
                typeof state.error.data === "object" &&
                "message" in state.error.data &&
                typeof (state.error.data as { message?: unknown }).message === "string"
                  ? (state.error.data as { message: string }).message
                  : null) ?? `Failed (${state.error.status})`}
              </div>
            ) : null}

            <Button
              type="button"
              variant="luxury"
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
                const res = await processScan({
                  eventType: eventType as (typeof SCAN_EVENT_TYPE_VALUES)[number],
                  rfidTagId: rfidTagId.trim() || undefined,
                  itemCode: itemCode.trim().toUpperCase() || undefined,
                  location: location || null,
                  metadata,
                }).unwrap();
                setResult(res);
              }}
            >
              {state.isLoading ? "Processing…" : "Submit scan"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-amber/15">
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
                    <span className="text-xs text-destructive">Previously missing — cleared on scan</span>
                  ) : null}
                </div>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Item</dt>
                    <dd className="font-mono text-foreground">{result.linenItem.itemCode}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">RFID</dt>
                    <dd className="font-mono text-foreground">{result.linenItem.rfidTagId}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Wash count</dt>
                    <dd className="font-mono tabular-nums text-foreground">{result.linenItem.washCount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Scan id</dt>
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
