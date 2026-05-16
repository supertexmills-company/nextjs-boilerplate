"use client";

import { Settings2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { SystemSettings } from "@/entities/settings/types";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/features/settings/api/settingsApi";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { Skeleton } from "@/features/dashboard/components/Skeleton";
import { useAppSelector } from "@/store/hooks";
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

export default function SettingsPage() {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "admin";
  const { data: settings, isLoading, refetch } = useGetSettingsQuery();

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 luxury-enter">
      <PageHeader
        kicker="Management"
        title="Settings"
        subtitle="System thresholds governing wash lifecycle and low-stock alerting."
      />

      {!isAdmin ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Settings2 className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">View only</CardTitle>
            </div>
            <CardDescription>
              Updating settings requires{" "}
              <Badge variant="outline" intent="brand" dot>
                admin
              </Badge>{" "}
              access.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configured values</CardTitle>
            <CardDescription>Current global policy document.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Row label="Max wash cycles" value={settings.maxWashCycles} />
            <Row label="Replace-soon %" value={`${settings.replaceSoonThresholdPercent}%`} />
            <Row label="Missing after (hours)" value={settings.missingAfterHours} />
            <Row label="Default low inventory threshold" value={settings.defaultLowInventoryThreshold} />
            <div>
              <p className="kicker">Per-type thresholds</p>
              <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/30 p-3 text-xs font-mono">
                {JSON.stringify(settings.lowInventoryThresholdByType ?? {}, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {isAdmin ? (
          <SettingsAdminForm
            key={`${String(settings._id ?? settings.id ?? "global")}-${String(settings.updatedAt ?? "")}`}
            settings={settings}
            onSaved={() => void refetch()}
          />
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Sign in as an administrator to edit policy values.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SettingsAdminForm({ settings, onSaved }: { settings: SystemSettings; onSaved: () => void }) {
  const [updateSettings, updateState] = useUpdateSettingsMutation();
  const [maxWashCycles, setMaxWashCycles] = useState(settings.maxWashCycles);
  const [replaceSoonThresholdPercent, setReplaceSoonThresholdPercent] = useState(settings.replaceSoonThresholdPercent);
  const [missingAfterHours, setMissingAfterHours] = useState(settings.missingAfterHours);
  const [defaultLowInventoryThreshold, setDefaultLowInventoryThreshold] = useState(
    settings.defaultLowInventoryThreshold,
  );
  const [thresholdMapJson, setThresholdMapJson] = useState(
    `${JSON.stringify(settings.lowInventoryThresholdByType ?? {}, null, 2)}\n`,
  );

  return (
    <Card accent>
      <CardHeader>
        <CardTitle className="text-lg">Update settings</CardTitle>
        <CardDescription>PATCH /settings — applies on next scans and housekeeping jobs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberField label="Max wash cycles" value={maxWashCycles} onChange={setMaxWashCycles} min={1} />
        <NumberField
          label="Replace-soon threshold (%)"
          value={replaceSoonThresholdPercent}
          onChange={setReplaceSoonThresholdPercent}
          min={1}
          max={100}
        />
        <NumberField label="Missing after (hours)" value={missingAfterHours} onChange={setMissingAfterHours} min={1} />
        <NumberField
          label="Default low inventory threshold"
          value={defaultLowInventoryThreshold}
          onChange={setDefaultLowInventoryThreshold}
          min={0}
        />
        <Field label="Per-type thresholds" htmlFor="threshold-json" helper="JSON object">
          <Textarea
            id="threshold-json"
            className="min-h-[7rem] font-mono text-xs"
            value={thresholdMapJson}
            onChange={(e) => setThresholdMapJson(e.target.value)}
          />
        </Field>

        <Button
          type="button"
          variant="primary"
          disabled={updateState.isLoading}
          onClick={async () => {
            let lowInventoryThresholdByType: Record<string, number> = {};
            try {
              const parsed: unknown = JSON.parse(thresholdMapJson || "{}");
              if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                lowInventoryThresholdByType = Object.fromEntries(
                  Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [
                    k,
                    typeof v === "number" ? v : Number(v),
                  ]),
                );
              }
            } catch {
              lowInventoryThresholdByType = {};
            }
            try {
              await updateSettings({
                maxWashCycles,
                replaceSoonThresholdPercent,
                missingAfterHours,
                defaultLowInventoryThreshold,
                lowInventoryThresholdByType,
              }).unwrap();
              toast.success("Settings saved");
              onSaved();
            } catch (err) {
              toast.error(errorMessage(err, "Could not save settings"));
            }
          }}
        >
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const id = `nf-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <Field label={label} htmlFor={id}>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}
