"use client"

import { Code, ShieldCheck, Sigma } from "lucide-react"
import type { Dict, Lang } from "@/lib/i18n"

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
      {icon}
      {label}
    </span>
  )
}

export function SiteHeader({
  lang,
  onLangChange,
  t,
}: {
  lang: Lang
  onLangChange: (l: Lang) => void
  t: Dict
}) {
  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* subtle grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--neon-blue) 1px, transparent 1px), linear-gradient(90deg, var(--neon-blue) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
              <Sigma className="size-6" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                TAO<span className="text-neon-green">Quant</span>
              </h1>
              <p className="max-w-md text-pretty text-sm text-muted-foreground md:text-base">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Language toggle */}
          <div className="flex shrink-0 items-center rounded-full border border-border bg-secondary/60 p-0.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => onLangChange("en")}
              aria-pressed={lang === "en"}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                lang === "en"
                  ? "bg-blue-600 font-bold text-white shadow-sm"
                  : "font-normal text-muted-foreground hover:text-foreground"
              }`}
            >
              {"\u{1F1FA}\u{1F1F8}"} EN
            </button>
            <button
              type="button"
              onClick={() => onLangChange("pt")}
              aria-pressed={lang === "pt"}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                lang === "pt"
                  ? "bg-blue-600 font-bold text-white shadow-sm"
                  : "font-normal text-muted-foreground hover:text-foreground"
              }`}
            >
              {"\u{1F1E7}\u{1F1F7}"} PT
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge icon={<Sigma className="size-3.5" />} label={t.badges.deterministic} />
          <Badge icon={<Code className="size-3.5" />} label={t.badges.openSource} />
          <Badge icon={<ShieldCheck className="size-3.5 text-neon-green" />} label={t.badges.noAi} />
          <span className="ml-auto hidden items-center gap-2 font-mono text-xs text-muted-foreground sm:inline-flex">
            <span className="relative flex size-2" title={t.net.status} aria-label={t.net.status}>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            bittensor · tao
          </span>
        </div>
      </div>
    </header>
  )
}
