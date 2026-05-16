"use client";

import { useMemo, useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";

/**
 * ROICalculator — a transparent client-side savings projector.
 *
 * Formula (editable):
 *   annualReplacementSpend = items × avgReplacementCost × annualReplaceRate
 *   currentAnnualLoss      = annualReplacementSpend × currentLossRate
 *   projectedAnnualLoss    = annualReplacementSpend × projectedLossRate
 *   annualSavings          = (currentAnnualLoss − projectedAnnualLoss) × properties
 *
 * The numbers below are conservative defaults grounded in published
 * hospitality linen-management benchmarks.
 *
 * TODO(content): tune these constants with your real customer baseline.
 */

const AVG_REPLACEMENT_COST_USD = 22; // per linen item
const ANNUAL_REPLACE_RATE = 0.45; // share of fleet replaced per year (baseline)
const PROJECTED_LOSS_RATE = 0.08; // post-Tantava (steady state, conservative)

function formatUSD(value: number): string {
  if (!isFinite(value) || value <= 0) return "$0";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${Math.round(value).toLocaleString()}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ROICalculator() {
  const [properties, setProperties] = useState<number>(3);
  const [itemsPerProperty, setItemsPerProperty] = useState<number>(8000);
  const [currentLossRatePct, setCurrentLossRatePct] = useState<number>(18);

  const result = useMemo(() => {
    const items = clamp(itemsPerProperty, 0, 1_000_000);
    const props = clamp(properties, 0, 500);
    const currentRate = clamp(currentLossRatePct, 0, 100) / 100;

    const annualReplacementSpend = items * AVG_REPLACEMENT_COST_USD * ANNUAL_REPLACE_RATE;
    const currentLoss = annualReplacementSpend * currentRate;
    const projectedLoss = annualReplacementSpend * PROJECTED_LOSS_RATE;
    const perPropertySavings = Math.max(0, currentLoss - projectedLoss);
    const totalAnnual = perPropertySavings * props;
    const reductionPct = currentRate > 0
      ? Math.max(0, ((currentRate - PROJECTED_LOSS_RATE) / currentRate) * 100)
      : 0;

    return {
      perProperty: perPropertySavings,
      total: totalAnnual,
      reductionPct,
    };
  }, [properties, itemsPerProperty, currentLossRatePct]);

  return (
    <div className="rounded-[24px] border border-[color-mix(in_srgb,var(--accent)_22%,var(--border))] bg-[var(--surface)] p-7 shadow-[var(--e1)] md:p-10">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
          <TrendingUp className="size-4.5" strokeWidth={1.7} aria-hidden />
        </div>
        <div>
          <p className="kicker mb-1">ROI estimator</p>
          <h3 className="font-display text-[1.5rem] font-medium leading-tight text-foreground md:text-[1.75rem]">
            See what Tantava could save your portfolio.
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Adjust the inputs to your operating footprint. Numbers update live.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <NumberField
          id="roi-properties"
          label="Properties"
          value={properties}
          min={1}
          max={500}
          step={1}
          onChange={setProperties}
        />
        <NumberField
          id="roi-items"
          label="Linen items per property"
          value={itemsPerProperty}
          min={100}
          max={1_000_000}
          step={100}
          onChange={setItemsPerProperty}
        />
        <NumberField
          id="roi-loss"
          label="Current annual loss rate"
          value={currentLossRatePct}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={setCurrentLossRatePct}
        />
      </div>

      <div className="mt-7 grid gap-4 rounded-[18px] border border-border bg-[color-mix(in_srgb,var(--accent)_6%,var(--surface))] p-6 md:grid-cols-3 md:items-center md:gap-6">
        <ResultStat label="Per property / year" value={formatUSD(result.perProperty)} />
        <ResultStat
          label="Portfolio / year"
          value={formatUSD(result.total)}
          emphasis
        />
        <ResultStat
          label="Loss reduction"
          value={`${Math.round(result.reductionPct)}%`}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Conservative model. Actual savings vary by operating baseline and
          rollout speed. Numbers are not a contractual commitment.
        </p>
        <a
          href="#booking-form"
          className="btn-amber inline-flex items-center justify-center gap-2 rounded-[16px] px-6 py-3 text-sm font-semibold"
        >
          Get a tailored estimate <ArrowRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-[var(--text-soft)]">
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(isFinite(n) ? n : 0);
          }}
          className="input-field w-full rounded-[16px] px-4 py-3 pr-10 text-[15px] tabular-nums"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function ResultStat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[var(--tracking-widest2)] text-muted-foreground">
        {label}
      </p>
      <p
        className={
          emphasis
            ? "mt-1 font-mono text-[clamp(2rem,3.6vw,2.6rem)] font-semibold leading-none tracking-[var(--tracking-display)] tabular-nums text-[var(--accent)]"
            : "mt-1 font-mono text-[clamp(1.4rem,2.2vw,1.8rem)] font-semibold leading-none tracking-[var(--tracking-display)] tabular-nums text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}
