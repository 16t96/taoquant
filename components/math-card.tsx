"use client"

import { FunctionSquare, Network, ShieldCheck, TrendingUp } from "lucide-react"
import type { Dict } from "@/lib/i18n"

function Pillar({
  icon,
  color,
  name,
  desc,
}: {
  icon: React.ReactNode
  color: string
  name: string
  desc: string
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="flex size-7 items-center justify-center rounded-md"
          style={{ color, backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` }}
        >
          {icon}
        </span>
        <h3 className="font-mono text-sm font-semibold text-foreground">{name}</h3>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}

export function MathCard({ t }: { t: Dict }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <FunctionSquare className="size-4 text-primary" />
        <div>
          <h2 className="font-mono text-sm font-semibold text-foreground">{t.math.title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t.math.description}</p>
        </div>
      </div>

      {/* Formula block */}
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warn/70" />
          <span className="size-2.5 rounded-full bg-neon-green/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">{t.math.formulaLabel}</span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed text-foreground md:text-sm">
          <code>
            <span className="text-neon-blue">IRA</span> = 100 × (
            {"\n"}
            {"  "}w1 · <span className="text-neon-blue">stability</span> +{"\n"}
            {"  "}w2 · <span className="text-neon-green">decentralization</span> +{"\n"}
            {"  "}w3 · <span className="text-warn">efficiency</span>
            {"\n"})
            {"\n\n"}
            <span className="text-muted-foreground">
              {"// each pillar is clamped to [0, 1] — never negative"}
            </span>
            {"\n"}
            stability{"        "}= max(0, 1 − CV){"\n"}
            decentralization = clamp(1 − HHI){"\n"}
            efficiency{"       "}= max(0, 1 − churn / 100){"\n\n"}
            <span className="text-muted-foreground">{"// churn is a percentage (0..100); scale clamped to [0,1]"}</span>
            {"\n"}
            <span className="text-muted-foreground">{"// constraint"}</span>
            {"\n"}
            w1 + w2 + w3 = 1.0
          </code>
        </pre>
      </div>

      <h3 className="mb-3 mt-6 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t.math.pillarsTitle}
      </h3>
      <div className="grid gap-3 md:grid-cols-3">
        <Pillar
          icon={<TrendingUp className="size-4" />}
          color="var(--neon-blue)"
          name={t.math.pillars.stability.name}
          desc={t.math.pillars.stability.desc}
        />
        <Pillar
          icon={<Network className="size-4" />}
          color="var(--neon-green)"
          name={t.math.pillars.decentralization.name}
          desc={t.math.pillars.decentralization.desc}
        />
        <Pillar
          icon={<ShieldCheck className="size-4" />}
          color="var(--warn)"
          name={t.math.pillars.efficiency.name}
          desc={t.math.pillars.efficiency.desc}
        />
      </div>

      <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        {t.math.note}
      </p>
    </section>
  )
}
