"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ChevronsUpDown, Database, Radio } from "lucide-react"
import type { Dict } from "@/lib/i18n"
import {
  computeIRA,
  type DataSource,
  riskLevel,
  type Subnet,
  type Weights,
} from "@/lib/taoquant"

type SortKey = "id" | "apy" | "cv" | "hhi" | "churn" | "ira"
type SortDir = "asc" | "desc"

function IraBadge({ ira, t }: { ira: number; t: Dict }) {
  const level = riskLevel(ira)
  const cfg = {
    low: { color: "var(--neon-green)", label: t.risk.low },
    medium: { color: "var(--warn)", label: t.risk.medium },
    high: { color: "var(--danger)", label: t.risk.high },
  }[level]

  return (
    <div className="flex items-center justify-end gap-2">
      <span
        className="inline-flex min-w-9 items-center justify-center rounded-md px-2 py-1 font-mono text-sm font-bold tabular-nums"
        style={{
          color: cfg.color,
          backgroundColor: `color-mix(in srgb, ${cfg.color} 14%, transparent)`,
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${cfg.color} 35%, transparent)`,
        }}
      >
        {ira}
      </span>
      <span className="hidden font-mono text-xs text-muted-foreground lg:inline" style={{ minWidth: 72 }}>
        {cfg.label}
      </span>
    </div>
  )
}

function Th({
  label,
  active,
  dir,
  onClick,
  align = "right",
  title,
}: {
  label: string
  active: boolean
  dir: SortDir
  onClick: () => void
  align?: "left" | "right"
  title?: string
}) {
  return (
    <th
      className={`whitespace-nowrap px-3 py-3 font-mono text-xs font-medium ${
        align === "right" ? "text-right" : "text-left"
      }`}
      title={title}
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${
          align === "right" ? "flex-row-reverse" : ""
        } ${active ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
        {active ? (
          dir === "desc" ? (
            <ArrowDown className="size-3.5" />
          ) : (
            <ArrowUp className="size-3.5" />
          )
        ) : (
          <ChevronsUpDown className="size-3.5 opacity-50" />
        )}
      </button>
    </th>
  )
}

export function SubnetTable({
  subnets,
  weights,
  source,
  onSourceChange,
  t,
}: {
  subnets: Subnet[]
  weights: Weights
  source: DataSource
  onSourceChange: (s: DataSource) => void
  t: Dict
}) {
  const [sortKey, setSortKey] = useState<SortKey>("ira")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const rows = useMemo(() => {
    const withIra = subnets.map((s) => ({ ...s, ira: computeIRA(s, weights) }))
    return withIra.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      return sortDir === "desc" ? bv - av : av - bv
    })
  }, [subnets, weights, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const c = t.table.cols

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <h2 className="font-mono text-sm font-semibold text-foreground">{t.table.title}</h2>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {t.table.source}:{" "}
            {source === "mock" ? t.table.sourceMock : t.table.sourceLive}
          </p>
        </div>

        {/* Data source toggle */}
        <div className="flex items-center rounded-lg border border-border bg-secondary/60 p-0.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => onSourceChange("mock")}
            aria-pressed={source === "mock"}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
              source === "mock"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Database className="size-3.5" />
            {t.table.mock}
          </button>
          <button
            type="button"
            onClick={() => onSourceChange("live")}
            aria-pressed={source === "live"}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
              source === "live"
                ? "bg-neon-green text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Radio className="size-3.5" />
            {t.table.live}
          </button>
        </div>
      </div>

      {source === "live" && (
        <p className="border-b border-border bg-warn/10 px-5 py-2 font-mono text-xs text-warn md:px-6">
          {t.table.liveSoon}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <Th
                label={c.subnet}
                align="left"
                active={sortKey === "id"}
                dir={sortDir}
                onClick={() => toggleSort("id")}
              />
              <Th
                label={c.apy}
                active={sortKey === "apy"}
                dir={sortDir}
                onClick={() => toggleSort("apy")}
                title={t.table.tips.apy}
              />
              <Th
                label={c.cv}
                active={sortKey === "cv"}
                dir={sortDir}
                onClick={() => toggleSort("cv")}
                title={t.table.tips.cv}
              />
              <Th
                label={c.hhi}
                active={sortKey === "hhi"}
                dir={sortDir}
                onClick={() => toggleSort("hhi")}
                title={t.table.tips.hhi}
              />
              <Th
                label={c.churn}
                active={sortKey === "churn"}
                dir={sortDir}
                onClick={() => toggleSort("churn")}
                title={t.table.tips.churn}
              />
              <Th
                label={c.ira}
                active={sortKey === "ira"}
                dir={sortDir}
                onClick={() => toggleSort("ira")}
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr
                key={s.id}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
              >
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-neon-blue">
                      SN{s.id}
                    </span>
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-right font-mono tabular-nums text-neon-green">
                  {s.apy.toFixed(1)}%
                </td>
                <td className="px-3 py-3.5 text-right font-mono tabular-nums text-muted-foreground">
                  {s.cv.toFixed(2)}
                </td>
                <td className="px-3 py-3.5 text-right font-mono tabular-nums text-muted-foreground">
                  {s.hhi.toFixed(2)}
                </td>
                <td className="px-3 py-3.5 text-right font-mono tabular-nums text-muted-foreground">
                  {s.churn.toFixed(0)}%
                </td>
                <td className="px-3 py-3.5 text-right">
                  <IraBadge ira={s.ira} t={t} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
