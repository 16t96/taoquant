"use client"

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
  const [toast, setToast] = useState<string | null>(null)

  const t = translations[lang]

  useEffect(() => {
    let active = true
    fetchSubnets(source)
      .then((data) => {
        if (active) setSubnets(data)
      })
      .catch(() => {
        if (!active) return
        // Gracefully keep the mock data on screen and surface the error.
        setSubnets(MOCK_SUBNETS)
        setSource("mock")
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

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <section id="ira-model" className="scroll-mt-6">
          <ParamsPanel weights={weights} onChange={setWeights} t={t} />
        </section>
        <section id="dashboard" className="scroll-mt-6">
          <SubnetTable
            subnets={subnets}
            weights={weights}
            source={source}
            onSourceChange={setSource}
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
