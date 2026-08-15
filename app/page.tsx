"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { ParamsPanel } from "@/components/params-panel"
import { SubnetTable } from "@/components/subnet-table"
import { MathCard } from "@/components/math-card"
import { DonationCard } from "@/components/donation-card"
import { SiteFooter } from "@/components/site-footer"
import { Toast } from "@/components/toast"
import { type Lang, translations } from "@/lib/i18n"
import {
  type DataSource,
  DEFAULT_WEIGHTS,
  fetchSubnets,
  MOCK_SUBNETS,
  type Subnet,
  type Weights,
} from "@/lib/taoquant"

export default function Page() {
  const [lang, setLang] = useState<Lang>("en")
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS)
  const [source, setSource] = useState<DataSource>("mock")
  const [subnets, setSubnets] = useState<Subnet[]>(MOCK_SUBNETS)
  const [liveError, setLiveError] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const t = translations[lang]

  useEffect(() => {
    let active = true
    if (source === "live") setLiveError(false)
    fetchSubnets(source)
      .then((data) => {
        if (active) {
          setSubnets(data)
          setLiveError(false)
        }
      })
      .catch(() => {
        if (!active) return
        // Gracefully keep the mock data on screen and surface the error.
        setSubnets(MOCK_SUBNETS)
        setSource("mock")
        setLiveError(true)
        setToast(t.table.liveError)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source])

  return (
    <main className="min-h-dvh">
      <SiteHeader lang={lang} onLangChange={setLang} t={t} />

      <section className="relative isolate overflow-hidden border-b border-border/60" aria-label="TAOQuant analytics banner">
        <Image
          src="/taoquant-banner.png"
          alt="Isometric TAOQuant Web3 analytics dashboard with risk gauges and performance charts"
          width={1920}
          height={1080}
          priority
          className="h-64 w-full object-cover object-center opacity-80 md:h-80 lg:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-2xl items-center px-6 py-8 md:px-12">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.28em] text-neon-cyan">Bittensor analytics</p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">TAOQuant</h1>
            <p className="mt-3 max-w-lg text-pretty text-sm leading-6 text-muted-foreground md:text-base">Deterministic subnet intelligence, risk scoring, and APY stability analysis in one auditable workspace.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <section id="ira-model" className="scroll-mt-6">
          <ParamsPanel weights={weights} onChange={setWeights} t={t} />
        </section>
        <section id="dashboard" className="scroll-mt-6">
          <SubnetTable
            subnets={subnets}
            weights={weights}
            source={source}
              onSourceChange={(nextSource) => {
                setLiveError(false)
                setSource(nextSource)
              }}
            liveError={liveError}
            t={t}
          />
        </section>
        <MathCard t={t} />
        <section id="donations" className="scroll-mt-6">
          <DonationCard t={t} />
        </section>
      </div>

      <SiteFooter t={t} />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  )
}
