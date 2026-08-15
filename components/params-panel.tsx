"use client"

import { RotateCcw, SlidersHorizontal } from "lucide-react"
import type { Dict } from "@/lib/i18n"
import { adjustWeights, DEFAULT_WEIGHTS, type Weights } from "@/lib/taoquant"

function WeightSlider({
  label,
  value,
  color,
  onChange,
}: {
  label: string
  value: number
  color: string
  onChange: (v: number) => void
}) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="font-mono text-sm font-semibold tabular-nums" style={{ color }}>
          {pct}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="tq-range w-full"
        style={
          {
            "--tq-accent": color,
            "--tq-pct": `${pct}%`,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

export function ParamsPanel({
  weights,
  onChange,
  t,
}: {
  weights: Weights
  onChange: (w: Weights) => void
  t: Dict
}) {
  const total = Math.round((weights.w1 + weights.w2 + weights.w3) * 100)

  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
      <style>{`
        .tq-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            var(--tq-accent) 0%,
            var(--tq-accent) var(--tq-pct),
            var(--secondary) var(--tq-pct),
            var(--secondary) 100%
          );
          cursor: pointer;
        }
        .tq-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: var(--tq-accent);
          border: 3px solid var(--card);
          box-shadow: 0 0 0 1px var(--tq-accent), 0 0 8px color-mix(in srgb, var(--tq-accent) 60%, transparent);
        }
        .tq-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: var(--tq-accent);
          border: 3px solid var(--card);
        }
      `}</style>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="size-4 text-primary" />
          <div>
            <h2 className="font-mono text-sm font-semibold text-foreground">{t.params.title}</h2>
            <p className="mt-0.5 max-w-md text-xs text-muted-foreground">{t.params.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_WEIGHTS)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          <span className="hidden sm:inline">{t.params.reset}</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <WeightSlider
          label={t.params.w1}
          value={weights.w1}
          color="var(--neon-blue)"
          onChange={(v) => onChange(adjustWeights(weights, "w1", v))}
        />
        <WeightSlider
          label={t.params.w2}
          value={weights.w2}
          color="var(--neon-green)"
          onChange={(v) => onChange(adjustWeights(weights, "w2", v))}
        />
        <WeightSlider
          label={t.params.w3}
          value={weights.w3}
          color="var(--warn)"
          onChange={(v) => onChange(adjustWeights(weights, "w3", v))}
        />
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4 font-mono text-xs">
        <span className="text-muted-foreground">{t.params.total}</span>
        <span className="rounded bg-neon-green/10 px-2 py-0.5 font-semibold text-neon-green tabular-nums">
          {total}%
        </span>
      </div>
    </section>
  )
}
